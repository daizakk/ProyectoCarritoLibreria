using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibreriaPedroApi.Models
{
    public class Usuario
    {
        public int Id { get; set; }

        [MaxLength(100)]
        public string? Username { get; set; }  // Campo existente

        [Required]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;  // Campo existente

        [MaxLength(20)]
        public string? Role { get; set; }  // Campo existente

        [MaxLength(100)]
        public string? Nombre { get; set; }

        [MaxLength(20)]
        public string? Telefono { get; set; }

        [MaxLength(255)]
        public string? Direccion { get; set; }

        [MaxLength(100)]
        public string? Ciudad { get; set; }

        public DateTime? FechaCreacion { get; set; }
    }
}

