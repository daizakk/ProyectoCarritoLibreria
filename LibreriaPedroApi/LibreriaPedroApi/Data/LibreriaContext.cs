using LibreriaPedroApi.Models;
using Microsoft.EntityFrameworkCore;

namespace LibreriaPedroApi.Data
{
    public class LibreriaContext : DbContext
    {
        public LibreriaContext(DbContextOptions<LibreriaContext> options)
            : base(options) { }

        public DbSet<Models.Libro> Libros => Set<Models.Libro>();
        public DbSet<Models.Usuario> Usuarios => Set<Models.Usuario>();
        public DbSet<Models.Pedido> Pedidos => Set<Models.Pedido>();
        public DbSet<Models.DetallePedido> DetallesPedido => Set<Models.DetallePedido>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<Libro>(entity =>
            {
                entity.ToTable("Libros");              
                entity.HasIndex(l => l.Isbn).IsUnique();

                entity.Property(l => l.Isbn).IsRequired().HasMaxLength(20);
                entity.Property(l => l.Titulo).IsRequired().HasMaxLength(200);
                entity.Property(l => l.Autor).IsRequired().HasMaxLength(150);
                entity.Property(l => l.Editorial).IsRequired().HasMaxLength(100);
                entity.Property(l => l.Formato).IsRequired().HasMaxLength(50);
                entity.Property(l => l.Edicion).IsRequired().HasMaxLength(50);
                entity.Property(l => l.Precio).HasColumnType("decimal(10,2)");
                entity.Property(l => l.ImagenUrl).HasMaxLength(500);
                entity.Property(l => l.Stock).HasDefaultValue(0);
            });

            modelBuilder.Entity<Pedido>(entity =>
            {
                entity.ToTable("Pedido");
                entity.Property(p => p.Total).HasColumnType("decimal(10,2)");
                entity.Property(p => p.Estado).HasMaxLength(50);
                entity.HasOne(p => p.Usuario)
                      .WithMany()
                      .HasForeignKey(p => p.UsuarioId);
            });

            modelBuilder.Entity<DetallePedido>(entity =>
            {
                entity.ToTable("DetallePedido");
                entity.Property(d => d.PrecioUnitario).HasColumnType("decimal(10,2)");
                entity.HasOne(d => d.Pedido)
                      .WithMany(p => p.Detalles)
                      .HasForeignKey(d => d.PedidoId);
                entity.HasOne(d => d.Libro)
                      .WithMany()
                      .HasForeignKey(d => d.LibroId);
            });

            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.ToTable("Usuario");
                entity.HasIndex(u => u.Email).IsUnique();

                entity.Property(u => u.Email).IsRequired().HasMaxLength(100);
                entity.Property(u => u.PasswordHash).IsRequired();
                entity.Property(u => u.Username).HasMaxLength(100);
                entity.Property(u => u.Nombre).HasMaxLength(100);
                entity.Property(u => u.Telefono).HasMaxLength(20);
                entity.Property(u => u.Direccion).HasMaxLength(255);
                entity.Property(u => u.Ciudad).HasMaxLength(100);
                entity.Property(u => u.Role).HasMaxLength(20);
            });
        }
    }

}