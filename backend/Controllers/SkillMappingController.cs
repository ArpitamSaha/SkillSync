﻿using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace ResumeFilterBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SkillMappingController : ControllerBase
    {
        private readonly string _jsonPath;

        public SkillMappingController()
        {
            _jsonPath = Path.Combine(Directory.GetCurrentDirectory(), "skill_mapping.json");
        }

        [HttpGet("get-all-skills")]
        public async Task<IActionResult> GetAllSkills()
        {
            var skillMapping = await LoadSkillMappings();
            return Ok(skillMapping);
        }

        [HttpPost("add-skill")]
        public async Task<IActionResult> AddSkill([FromBody] SkillMappingRequest request)
        {
            if (string.IsNullOrEmpty(request.Key) || string.IsNullOrEmpty(request.Value))
            {
                return BadRequest("Key and Value cannot be empty");
            }

            var skillMapping = await LoadSkillMappings();

            if (!skillMapping.ContainsKey(request.Key))
            {
                skillMapping[request.Key] = new List<string>();
            }

            if (!skillMapping[request.Key].Contains(request.Value))
            {
                skillMapping[request.Key].Add(request.Value);
            }

            await SaveSkillMappings(skillMapping);

            return Ok("Skill added successfully");
        }

        [HttpDelete("delete-skill")]
        public async Task<IActionResult> DeleteSkill([FromBody] SkillMappingRequest request)
        {
            if (string.IsNullOrEmpty(request.Key) || string.IsNullOrEmpty(request.Value))
            {
                return BadRequest("Key and Value cannot be empty");
            }

            var skillMapping = await LoadSkillMappings();

            if (!skillMapping.ContainsKey(request.Key))
            {
                return NotFound("Skill category not found");
            }

            if (!skillMapping[request.Key].Remove(request.Value))
            {
                return NotFound("Skill not found in the specified category");
            }

            // Remove the category if it's empty after deletion
            if (skillMapping[request.Key].Count == 0)
            {
                skillMapping.Remove(request.Key);
            }

            await SaveSkillMappings(skillMapping);

            return Ok("Skill deleted successfully");
        }

        private async Task<Dictionary<string, List<string>>> LoadSkillMappings()
        {
            if (System.IO.File.Exists(_jsonPath))
            {
                var json = await System.IO.File.ReadAllTextAsync(_jsonPath);
                return JsonConvert.DeserializeObject<Dictionary<string, List<string>>>(json) ?? new Dictionary<string, List<string>>();
            }

            return new Dictionary<string, List<string>>();
        }

        private async Task SaveSkillMappings(Dictionary<string, List<string>> skillMapping)
        {
            var json = JsonConvert.SerializeObject(skillMapping, Formatting.Indented);
            await System.IO.File.WriteAllTextAsync(_jsonPath, json);
        }
    }

    public class SkillMappingRequest
    {
        public string Key { get; set; }
        public string Value { get; set; }
    }
}