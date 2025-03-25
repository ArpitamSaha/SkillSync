using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResumeFilter.Models;
using System.Text;
using System.Text.RegularExpressions;
using UglyToad.PdfPig;
using UglyToad.PdfPig.Content;
using Newtonsoft.Json;
using System.Collections.Concurrent;
using Microsoft.Extensions.Logging;
using System.Drawing;

namespace ResumeFilter.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResumeController : ControllerBase
    {
        private readonly ResumeFilterContext _context;
        private readonly ILogger<ResumeController> _logger;
        private readonly Dictionary<string, List<string>> _skillMapping;

        // Correct constructor injection
        public ResumeController(
            ResumeFilterContext context, // Injected DbContext
            ILogger<ResumeController> logger)
        {
            _context = context;
            _logger = logger;
            _skillMapping = LoadSkillMappings(); // Your skill loader
        }

        // (Keep all other methods like LoadSkillMappings(), GetAllResumes(), etc.)

        [HttpPost("upload")]
        public async Task<IActionResult> UploadResume(IFormFileCollection files)
        {
            if (files == null || files.Count == 0)
                return BadRequest("No files uploaded");

            var results = new List<UploadResult>();
            foreach (var file in files)
            {
                var result = new UploadResult { FileName = file.FileName };
                try
                {
                    // 1. Validate file type and size
                    if (!IsValidPdfFile(file))
                    {
                        result.Error = "Invalid PDF file";
                        results.Add(result);
                        continue;
                    }

                    // 2. Read file data
                    using var ms = new MemoryStream();
                    await file.CopyToAsync(ms);
                    var fileData = ms.ToArray();

                    // 3. Check if file matches reported size
                    if (file.Length != fileData.Length)
                    {
                        result.Error = "File size mismatch";
                        results.Add(result);
                        continue;
                    }

                    // 4. Extract text (fallback methods included)
                    var text = ExtractTextWithFallbacks(fileData);
                    if (string.IsNullOrWhiteSpace(text))
                    {
                        result.Error = "Unprocessable PDF (image-based or corrupted)";
                        results.Add(result);
                        continue;
                    }

                    // 5. Map to your database model
                    var resume = new Resume
                    {
                        FileName = file.FileName,
                        FileData = fileData,
                        FileSize = file.Length, // Ensure this matches your DB column
                        UploadDate = DateTime.Now,
                        // Add other required fields per your schema
                    };

                    // 6. Save to DB
                    _context.Resumes.Add(resume);
                    await _context.SaveChangesAsync();

                    result.Success = true;
                    result.ResumeId = resume.Id;
                    result.FileSize = file.Length;
                }
                catch (Exception ex)
                {
                    result.Error = $"Upload failed: {ex.Message}";
                    _logger.LogError(ex, $"Error uploading {file.FileName}");
                }
                results.Add(result);
            }

            return Ok(new
            {
                Total = files.Count,
                Success = results.Count(r => r.Success),
                Failed = results.Count(r => !r.Success),
                Details = results
            });
        }

        // Helper Methods
        private bool IsValidPdfFile(IFormFile file)
        {
            // Check extension
            var validExtensions = new[] { ".pdf" };
            if (!validExtensions.Contains(Path.GetExtension(file.FileName).ToLower()))
                return false;

            // Check content type
            var validTypes = new[] { "application/pdf", "application/octet-stream" };
            if (!validTypes.Contains(file.ContentType.ToLower()))
                return false;

            // Check PDF header
            try
            {
                using var stream = file.OpenReadStream();
                using var reader = new BinaryReader(stream);
                var header = reader.ReadBytes(5);
                return Encoding.ASCII.GetString(header).StartsWith("%PDF-");
            }
            catch
            {
                return false;
            }
        }

        private string ExtractTextWithFallbacks(byte[] fileData)
        {
            try
            {
                // Try structured extraction first
                using var doc = PdfDocument.Open(fileData);
                var text = new StringBuilder();
                foreach (var page in doc.GetPages())
                {
                    text.AppendLine(page.Text);
                }
                return text.ToString();
            }
            catch
            {
                // Fallback to simple text extraction
                try
                {
                    using var doc = PdfDocument.Open(fileData, new ParsingOptions { UseLenientParsing = true });
                    return string.Join(" ", doc.GetPages().Select(p => p.Text));
                }
                catch
                {
                    return string.Empty;
                }
            }
        }

        private class UploadResult
        {
            public string FileName { get; set; }
            public bool Success { get; set; }
            public int? ResumeId { get; set; }
            public long FileSize { get; set; }
            public string Error { get; set; }
        }
    }
}