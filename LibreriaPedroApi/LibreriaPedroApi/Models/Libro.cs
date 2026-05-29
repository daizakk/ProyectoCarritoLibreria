using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibreriaPedroApi.Models
{
    public class Libro
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(20)]
        public string Isbn { get; set; } = string.Empty;       // NOT NULL en BDD

        [Required]
        [MaxLength(200)]
        public string Titulo { get; set; } = string.Empty;     // NOT NULL en BDD

        [Required]
        [MaxLength(150)]
        public string Autor { get; set; } = string.Empty;      // NOT NULL en BDD

        [Required]
        [MaxLength(100)]
        public string Editorial { get; set; } = string.Empty;  // NOT NULL en BDD

        [Required]
        [MaxLength(50)]
        public string Formato { get; set; } = string.Empty;    // NOT NULL en BDD

        [Required]
        [MaxLength(50)]
        public string Edicion { get; set; } = string.Empty;    // NOT NULL en BDD

        [Column(TypeName = "decimal(10,2)")]
        public decimal Precio { get; set; }                    // NOT NULL en BDD

        [MaxLength(500)]
        public string? ImagenUrl { get; set; }                 // NULL en BDD ✅

        public int Stock { get; set; } = 0;                   // NOT NULL DEFAULT 0 en BDD

        public string? Sinopsis { get; set; }                  // NULL en BDD ✅
    }
}