using LibreriaPedroApi.DTOs;
using LibreriaPedroApi.Models;
using System.Threading.Tasks;

namespace LibreriaPedroApi.Repositories
{
    public interface IUsuarioRepository
    {
        Task<Usuario?> LoginAsync(string email, string password);
        Task<Usuario?> RegistroAsync(UsuarioRegisterDto dto);
        Task<Usuario?> GetByEmailAsync(string email);
        Task<IEnumerable<Usuario>> GetAllAsync();
        Task<Usuario?> GetByIdAsync(int id);
    }
}
