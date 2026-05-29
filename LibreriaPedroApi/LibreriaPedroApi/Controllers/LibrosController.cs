using LibreriaPedroApi.Data;
using LibreriaPedroApi.DTOs;
using LibreriaPedroApi.Models;
using LibreriaPedroApi.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibreriaPedroApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LibrosController : ControllerBase
    {
        private readonly ILibroRepository _repository;
        public LibrosController(ILibroRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LibroResponseDto>>> GetAll()
        {
            var libros = await _repository.GetAllAsync();
            var response = libros.Select(l => new LibroResponseDto
            {
                Id = l.Id,
                Isbn = l.Isbn,
                Titulo = l.Titulo,
                Autor = l.Autor,
                Editorial = l.Editorial,
                Formato = l.Formato,
                Edicion = l.Edicion,
                Precio = l.Precio,
                ImagenUrl = !string.IsNullOrEmpty(l.ImagenUrl)
                    ? l.ImagenUrl
                    : $"https://books.google.com/books/content?vid=ISBN{l.Isbn}&printsec=frontcover&img=1&zoom=1",
                Stock = (int)l.Stock,
                Sinopsis = l.Sinopsis ?? string.Empty
            });
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<LibroResponseDto>> GetById(int id)
        {
            var libro = await _repository.GetByIdAsync(id);
            if (libro == null)
                return NotFound();
            var response = new LibroResponseDto
            {
                Id = libro.Id,
                Isbn = libro.Isbn,
                Titulo = libro.Titulo,
                Autor = libro.Autor,
                Editorial = libro.Editorial,
                Formato = libro.Formato,
                Edicion = libro.Edicion,
                Precio = libro.Precio,
                ImagenUrl = !string.IsNullOrEmpty(libro.ImagenUrl)
                    ? libro.ImagenUrl
                    : $"https://books.google.com/books/content?vid=ISBN{libro.Isbn}&printsec=frontcover&img=1&zoom=1",
                Stock = (int)libro.Stock,
                Sinopsis = libro.Sinopsis ?? string.Empty
            };
            return Ok(response);
        }

        [HttpGet("isbn/{isbn}")]
        public async Task<ActionResult<LibroResponseDto>> GetByIsbn(string isbn)
        {
            var libro = await _repository.GetByIsbnAsync(isbn);
            if (libro == null)
                return NotFound();
            var response = new LibroResponseDto
            {
                Id = libro.Id,
                Isbn = libro.Isbn,
                Titulo = libro.Titulo,
                Autor = libro.Autor,
                Editorial = libro.Editorial,
                Formato = libro.Formato,
                Edicion = libro.Edicion,
                Precio = libro.Precio,
                ImagenUrl = !string.IsNullOrEmpty(libro.ImagenUrl)
                    ? libro.ImagenUrl
                    : $"https://books.google.com/books/content?vid=ISBN{libro.Isbn}&printsec=frontcover&img=1&zoom=1",
                Stock = (int)libro.Stock,
                Sinopsis = libro.Sinopsis ?? string.Empty
            };
            return Ok(response);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult> Create(LibroRequestDto dto)
        {
            if (await _repository.ExistsByIsbnAsync(dto.Isbn))
                return BadRequest("El ISBN ya existe");
            var libro = new Libro
            {
                Isbn = dto.Isbn,
                Titulo = dto.Titulo,
                Autor = dto.Autor,
                Editorial = dto.Editorial,
                Formato = dto.Formato,
                Edicion = dto.Edicion,
                Precio = dto.Precio,
                ImagenUrl = dto.ImagenUrl,
                Stock = dto.Stock,
                Sinopsis = dto.Sinopsis
            };
            await _repository.AddAsync(libro);
            await _repository.SaveAsync();
            return CreatedAtAction(nameof(GetById), new { id = libro.Id }, null);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("isbn/{isbn}")]
        public async Task<IActionResult> Update(string isbn, LibroRequestDto dto)
        {
            var libro = await _repository.GetByIsbnAsync(isbn);
            if (libro == null)
                return NotFound();
            libro.Titulo = dto.Titulo;
            libro.Autor = dto.Autor;
            libro.Editorial = dto.Editorial;
            libro.Formato = dto.Formato;
            libro.Edicion = dto.Edicion;
            libro.Precio = dto.Precio;
            libro.ImagenUrl = dto.ImagenUrl;
            libro.Stock = dto.Stock;
            libro.Sinopsis = dto.Sinopsis;
            _repository.Update(libro);
            await _repository.SaveAsync();
            return NoContent();
        }


        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var libro = await _repository.GetByIdAsync(id);
            if (libro == null)
                return NotFound();
            _repository.Delete(libro);
            await _repository.SaveAsync();
            return NoContent();
        }
    }
}