import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cartFachada } from '../fcart';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-purchase-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './purchase-history.html',
  styleUrl: './purchase-history.css',
})
export class PurchaseHistoryComponent {
  private cartFacade = inject(cartFachada);
  orders = this.cartFacade.purchaseHistory;

  trackByOrderId(index: number, order: { id: number }): number {
    return order.id;
  }

  trackByProductId(index: number, item: { product: { id: number } }): number {
    return item.product.id;
  }

  descargarFactura(order: any) {
    const doc = new jsPDF();

    // ── Cabecera ──────────────────────────────────────────────────────────
    doc.setFillColor(42, 122, 228);
    doc.rect(0, 0, 210, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('LIBRERÍA DE PEDRO', 14, 15);

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(`FACTURA #${order.id}`, 150, 15);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(order.date, 150, 23);

    // ── Datos del pedido ──────────────────────────────────────────────────
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Detalle del pedido', 14, 50);

    // Línea separadora
    doc.setDrawColor(42, 122, 228);
    doc.setLineWidth(0.5);
    doc.line(14, 53, 196, 53);

    // Cabecera tabla
    doc.setFillColor(240, 246, 255);
    doc.rect(14, 56, 182, 8, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(42, 122, 228);
    doc.text('Producto', 16, 62);
    doc.text('Cant.', 120, 62);
    doc.text('Precio unit.', 140, 62);
    doc.text('Total', 175, 62);

    // Filas de productos
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    let y = 72;

    order.items.forEach((item: any, index: number) => {
      if (index % 2 === 0) {
        doc.setFillColor(249, 249, 249);
        doc.rect(14, y - 5, 182, 8, 'F');
      }

      doc.setFontSize(9);
      const titulo = item.product.title.length > 45
        ? item.product.title.substring(0, 45) + '...'
        : item.product.title;

      doc.text(titulo, 16, y);
      doc.text(String(item.quantity), 124, y);
      doc.text(`${item.product.price.toFixed(2)} EUR`, 140, y);
      doc.text(`${(item.product.price * item.quantity).toFixed(2)} EUR`, 172, y);

      y += 10;
    });

    // Línea antes del total
    doc.setDrawColor(42, 122, 228);
    doc.line(14, y, 196, y);
    y += 8;

    // Total
    doc.setFillColor(42, 122, 228);
    doc.rect(130, y - 5, 66, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', 134, y + 2);
    doc.text(`${order.total.toFixed(2)} EUR`, 163, y + 2);

    // ── Pie de página ─────────────────────────────────────────────────────
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Gracias por tu compra.', 14, 280);
    doc.text('Este documento es una factura simplificada.', 14, 285);

    doc.save(`factura-pedido-${order.id}.pdf`);
  }
}