namespace LibreriaPedroApi.DTOs
{
    public class PedidoRequestDto
    {
        public int UsuarioId { get; set; }
        public List<DetallePedidoRequestDto> Items { get; set; } = new();
    }

    public class DetallePedidoRequestDto
    {
        public int LibroId { get; set; }
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
    }
}