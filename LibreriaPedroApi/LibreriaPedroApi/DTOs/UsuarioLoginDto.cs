using System.ComponentModel.DataAnnotations;

namespace LibreriaPedroApi.DTOs
{
    public class UsuarioLoginDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;
    }
}
