using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibreriaPedroApi.Models
{
    public class DetallePedido
    {
        public int Id { get; set; }

        [Required]
        public int PedidoId { get; set; }

        [Required]
        public int LibroId { get; set; }

        public int Cantidad { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal PrecioUnitario { get; set; }

        public Pedido? Pedido { get; set; }
        public Libro? Libro { get; set; }
    }
}