using LibreriaPedroApi.Data;
using LibreriaPedroApi.Models;
using Microsoft.EntityFrameworkCore;

namespace LibreriaPedroApi.Repositories
{
    public class PedidoRepository : IPedidoRepository
    {
        private readonly LibreriaContext _context;

        public PedidoRepository(LibreriaContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Pedido>> GetByUsuarioIdAsync(int usuarioId)
        {
            return await _context.Pedidos
                .Include(p => p.Detalles)
                    .ThenInclude(d => d.Libro)
                .Where(p => p.UsuarioId == usuarioId)
                .OrderByDescending(p => p.FechaPedido)
                .ToListAsync();
        }

        public async Task AddAsync(Pedido pedido)
        {
            await _context.Pedidos.AddAsync(pedido);
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Pedido>> GetAllAsync()
        {
            return await _context.Pedidos
                .Include(p => p.Detalles)
                    .ThenInclude(d => d.Libro)
                .Include(p => p.Usuario)
                .OrderByDescending(p => p.FechaPedido)
                .ToListAsync();
        }
    }
}