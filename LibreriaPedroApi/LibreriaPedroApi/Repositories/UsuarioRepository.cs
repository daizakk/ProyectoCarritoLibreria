using LibreriaPedroApi.Data;
using LibreriaPedroApi.DTOs;
using LibreriaPedroApi.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace LibreriaPedroApi.Repositories
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly LibreriaContext _context;

        public UsuarioRepository(LibreriaContext context)
        {
            _context = context;
        }

        public async Task<Usuario?> LoginAsync(string email, string password)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == email);
            if (usuario == null)
                return null;

            if (!VerifyPassword(password, usuario.PasswordHash))
                return null;

            return usuario;
        }

        public async Task<Usuario?> RegistroAsync(UsuarioRegisterDto dto)
        {
           
            var usuarioExistente = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (usuarioExistente != null)
                return null; 

            var usuario = new Usuario
            {
                Username = dto.Email, 
                Nombre = dto.Nombre,
                Email = dto.Email,
                PasswordHash = HashPassword(dto.Password),
                Telefono = dto.Telefono,
                Direccion = dto.Direccion,
                Ciudad = dto.Ciudad,
                Role = "User",
                FechaCreacion = null
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return usuario;
        }

        public async Task<Usuario?> GetByEmailAsync(string email)
        {
            return await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<IEnumerable<Usuario>> GetAllAsync()
        {
            return await _context.Usuarios.ToListAsync();
        }

        public async Task<Usuario?> GetByIdAsync(int id)
        {
            return await _context.Usuarios.FirstOrDefaultAsync(u => u.Id == id);
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }

        private bool VerifyPassword(string password, string hash)
        {
            try
            {
                var hashOfInput = HashPassword(password);
                return hashOfInput.Equals(hash);
            }
            catch
            {
                return false;
            }
        }
    }
}
