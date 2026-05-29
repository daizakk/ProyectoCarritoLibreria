using LibreriaPedroApi.Models;

namespace LibreriaPedroApi.Repositories
{
    public interface ILibroRepository
    {
        Task<IEnumerable<Libro>> 
            GetAllAsync();
        Task<Libro?> GetByIdAsync(int id);
        Task<Libro?> GetByIsbnAsync(string isbn); // NUEVO
        Task<bool> ExistsByIsbnAsync(string isbn); // útil paravalidaciones
         Task AddAsync(Libro libro);
        void Update(Libro libro);
        void Delete(Libro libro);
        Task SaveAsync();
    }
}
