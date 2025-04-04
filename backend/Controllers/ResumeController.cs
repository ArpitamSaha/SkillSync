using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResumeFilterBackend.Models;
using System.Text;
using System.Text.RegularExpressions;
using Newtonsoft.Json;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Parser;
using NPOI.XWPF.UserModel;
using Xceed.Words.NET;

namespace ResumeFilter.Controllers

{

    [Route("api/[controller]")]

    [ApiController]

    public class ResumeController : ControllerBase

    {

        private readonly ResumeFilterContext _context;

        private readonly Dictionary<string, List<string>> skillMapping;

        public ResumeController(ResumeFilterContext context)

        {

            _context = context;

            skillMapping = LoadSkillMappings();

        }

        private Dictionary<string, List<string>> LoadSkillMappings()

        {

            try

            {

                string jsonPath = Path.Combine(Directory.GetCurrentDirectory(), "skill_mapping.json");

                if (System.IO.File.Exists(jsonPath))

                {

                    string json = System.IO.File.ReadAllText(jsonPath);

                    return JsonConvert.DeserializeObject<Dictionary<string, List<string>>>(json) ?? new Dictionary<string, List<string>>();

                }

            }

            catch (Exception ex)

            {

                Console.WriteLine($"Error loading skill mapping: {ex.Message}");

            }

            return new Dictionary<string, List<string>>();

        }
        private double ExtractExperienceYears(string resumeText)
        {
            if (string.IsNullOrWhiteSpace(resumeText))
                return 0;

            var regexPatterns = new List<string>
    {
        @"\btotal\s+(\d{1,2}(\.\d{1,2})?)\s?\+?\s?(?:yr|yrs|year|years|exp)\b",
        @"(\d{1,2}(\.\d{1,2})?)\s?\+?\s?(?:yr|yrs|year|years|exp)\b",
        @"experience\s?:?\s?(\d{1,2}(\.\d{1,2})?)\b"
    };

            var foundNumbers = new List<double>();

            foreach (var pattern in regexPatterns)
            {
                var matches = Regex.Matches(resumeText, pattern, RegexOptions.IgnoreCase);
                foreach (Match match in matches)
                {
                    if (match.Groups.Count > 1)
                    {
                        string extractedValue = match.Groups[1].Value;
                        if (double.TryParse(extractedValue, out double num) && num > 0 && num < 50)
                        {
                            foundNumbers.Add(num);
                        }
                    }
                }
            }

            return foundNumbers.Count > 0 ? foundNumbers.Max() : 0;
        }


        [HttpPost("upload")]
        public async Task<IActionResult> UploadResume(IFormFileCollection files)
        {
            if (files.Count == 0) return BadRequest("No files uploaded");

            foreach (var file in files)
            {
                if (file.Length > 0)
                {
                    // Check if the resume with the same file name already exists
                    var existingResume = await _context.Resumes
                        .FirstOrDefaultAsync(r => r.FileName == file.FileName);
                    if (existingResume != null)
                    {
                        return Conflict($"A resume with the name '{file.FileName}' already exists.");
                    }

                    using (var ms = new MemoryStream())
                    {
                        await file.CopyToAsync(ms);
                        var fileData = ms.ToArray();
                        var fileName = file.FileName;
                        string resumeText = ExtractText(fileName, fileData);
                        double experienceYears = ExtractExperienceYears(resumeText);
                        var resume = new Resume
                        {
                            FileName = fileName,
                            FileData = fileData,
                            YearsOfExperience = experienceYears
                        };

                        _context.Resumes.Add(resume);
                        await _context.SaveChangesAsync();
                    }
                }
            }
            return Ok("Resumes uploaded successfully");
        }

        [HttpGet("all")]
        public async Task GetAllResumes([FromQuery] string? keyword)
        {
            Response.ContentType = "application/json";
            await using var writer = new StreamWriter(Response.Body);

            var resumes = await _context.Resumes.ToListAsync();
            var keywordList = string.IsNullOrEmpty(keyword)
                ? new List<string>()
                : keyword.Split(',').Select(k => k.Trim().ToLower()).ToList();

            bool first = true;
            await writer.WriteAsync("[");
            await writer.FlushAsync();

            foreach (var resume in resumes)
            {
                string resumeText = ExtractText(resume.FileName, resume.FileData).ToLower();
                resumeText = Regex.Replace(resumeText, @"[^a-zA-Z0-9#\+\- ]", " ", RegexOptions.Compiled);

                // Check if resume matches any keyword
                bool isMatch = keywordList.Any(key =>
                    key == "c#" ? Regex.IsMatch(resumeText, @"(?<!\w)c#(?!\w)", RegexOptions.IgnoreCase) :
                    key == "c++" ? Regex.IsMatch(resumeText, @"(?<!\w)c\+\+(?!\w)", RegexOptions.IgnoreCase) :
                    Regex.IsMatch(resumeText, $@"\b{Regex.Escape(key)}\b", RegexOptions.IgnoreCase));

                if (string.IsNullOrEmpty(keyword) || isMatch)
                {
                    var resumeObj = new
                    {
                        resume.Id,
                        resume.FileName,
                        YearsOfExperience = resume.YearsOfExperience
                    };

                    string json = System.Text.Json.JsonSerializer.Serialize(resumeObj,
                        new System.Text.Json.JsonSerializerOptions { PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase });

                    if (!first)
                        await writer.WriteAsync(",");

                    await writer.WriteAsync(json);
                    await writer.FlushAsync();

                    first = false;
                }
            }

            await writer.WriteAsync("]");
            await writer.FlushAsync();
        }
        //private List<string> ExpandKeywords(List<string> keywords)

        //{

        //    var expandedKeywords = new HashSet<string>(keywords);

        //    foreach (var keyword in keywords)

        //    {

        //        if (skillMapping.ContainsKey(keyword))

        //        {

        //            foreach (var relatedSkill in skillMapping[keyword])

        //            {

        //                expandedKeywords.Add(relatedSkill);

        //            }

        //        }

        //    }

        //    return expandedKeywords.ToList();

        //}

        private string ExtractText(string fileName, byte[] fileData)

        {

            if (fileName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase))

            {

                return ExtractTextFromPdf(fileData);

            }

            else if (fileName.EndsWith(".docx", StringComparison.OrdinalIgnoreCase))

            {

                return ExtractTextFromDocx(fileData);

            }

            else if (fileName.EndsWith(".doc", StringComparison.OrdinalIgnoreCase))

            {

                return ExtractTextFromDoc(fileData);

            }

            return "";

        }

        private string ExtractTextFromPdf(byte[] fileData)

        {

            try

            {

                using (var pdfStream = new MemoryStream(fileData))

                using (var reader = new PdfReader(pdfStream))

                using (var pdfDoc = new PdfDocument(reader))

                {

                    StringBuilder text = new StringBuilder();

                    for (int i = 1; i <= pdfDoc.GetNumberOfPages(); i++)

                    {

                        text.AppendLine(PdfTextExtractor.GetTextFromPage(pdfDoc.GetPage(i)));

                    }

                    return text.ToString();

                }

            }

            catch (Exception ex)

            {

                Console.WriteLine($"Error extracting PDF text: {ex.Message}");

                return "";

            }

        }

        private string ExtractTextFromDocx(byte[] fileData)

        {

            try

            {

                using (var stream = new MemoryStream(fileData))

                {

                    XWPFDocument doc = new XWPFDocument(stream);

                    StringBuilder text = new StringBuilder();

                    foreach (XWPFParagraph paragraph in doc.Paragraphs)

                    {

                        text.AppendLine(paragraph.Text);

                    }

                    return text.ToString();

                }

            }

            catch (Exception ex)

            {

                Console.WriteLine($"Error extracting DOCX text: {ex.Message}");

                return "";

            }

        }

        private string ExtractTextFromDoc(byte[] fileData)

        {

            try

            {

                using (var stream = new MemoryStream(fileData))

                {

                    var doc = DocX.Load(stream);

                    string extractedText = doc.Text;

                    Console.WriteLine("Extracted .doc text: " + extractedText);

                    return extractedText;

                }

            }

            catch (Exception ex)

            {

                Console.WriteLine($"Error extracting DOC text: {ex.Message}");

                return "";

            }

        }

        [HttpPost("test-doc")]

        public IActionResult TestDocExtraction(IFormFile file)

        {

            if (file == null || file.Length == 0)

                return BadRequest("No file uploaded");

            using (var ms = new MemoryStream())

            {

                file.CopyTo(ms);

                string text = ExtractTextFromDoc(ms.ToArray());

                return Ok(new { extractedText = text });

            }

        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetResumeById(int id)
        {
            var resume = await _context.Resumes.FindAsync(id);
            if (resume == null) return NotFound($"No resume found with id {id}");

            return File(resume.FileData, "application/octet-stream", resume.FileName);
        }

    }

}


