using System;
using System.Collections.Generic;

namespace ResumeFilterBackend.Models;

public partial class Resume
{
    public int Id { get; set; }

    public string? FileName { get; set; }

    public byte[]? FileData { get; set; }

    public DateTime? UploadDate { get; set; }

    public double YearsOfExperience { get; set; }
}
