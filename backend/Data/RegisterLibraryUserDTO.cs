namespace LibraryAssessmentBackend.Data
{
    public class RegisterLibraryUserDTO
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }

        public LibraryRole ParseRole()
        {
            LibraryRole role;
            Enum.TryParse(Role, out role);
            return role;
        }
    }
}
