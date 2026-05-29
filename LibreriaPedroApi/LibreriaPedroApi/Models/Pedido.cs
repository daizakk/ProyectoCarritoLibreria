using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibreriaPedroApi.Models
{
    public class Pedido
    {
        public int Id { get; set; }

        [Required]
        public int UsuarioId { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime FechaPedido { get; set; } = DateTime.Now;
        [Column(TypeName = "decimal(10,2)")]
        public decimal Total { get; set; }

        [MaxLength(50)]
        public string Estado { get; set; } = "Pendiente";

        public Usuario? Usuario { get; set; }
        public ICollection<DetallePedido> Detalles { get; set; } = new List<DetallePedido>();
    }
}