// DTOs/PedidoResponseDto.cs
namespace LibreriaPedroApi.DTOs
{
    public class PedidoResponseDto
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public DateTime FechaPedido { get; set; }
        public decimal Total { get; set; }
        public string Estado { get; set; } = string.Empty;
        public List<DetallePedidoResponseDto> Detalles { get; set; } = new();
    }

    public class DetallePedidoResponseDto
    {
        public int LibroId { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
    }
}