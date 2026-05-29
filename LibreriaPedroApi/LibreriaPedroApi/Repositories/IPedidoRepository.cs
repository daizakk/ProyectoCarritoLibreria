using LibreriaPedroApi.Models;

namespace LibreriaPedroApi.Repositories
{
    public interface IPedidoRepository
    {
        Task<IEnumerable<Pedido>> GetByUsuarioIdAsync(int usuarioId);
        Task<IEnumerable<Pedido>> GetAllAsync();
        Task AddAsync(Pedido pedido);
        Task SaveAsync();
    }
}