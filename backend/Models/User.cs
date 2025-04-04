using System;
using System.Collections.Generic;

namespace ResumeFilterBackend.Models;

public partial class User
{
    public int Id { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public string EmailId { get; set; } = null!;

    public string Password { get; set; } = null!;
}
