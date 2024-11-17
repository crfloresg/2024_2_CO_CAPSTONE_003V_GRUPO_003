using InformeApi.Data;
using InformeApi.DTOs;
using InformeApi.Models;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System.Reflection.PortableExecutable;
using QuestPDF.Drawing;

namespace InformeApi.Services
{

    public class GeneeratePdfService() : GeneratePdf
    {

        private readonly string _imgFolder = "wwwroot/images/";

        public static Document generatePdfQuestProducto(List<InformeProducto> informeProd, int bodegaid, string nameEmployee, string nameBodega, string nametipoBodega)
        {
            var report = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(20);
                    page.Size(PageSizes.A4);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(10));

                    
                    page.Header().Row(row =>
                    {
                        row.RelativeItem(30)
                            .AlignLeft()
                            .Height(60)
                            .Image(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/icono_negro_rojo.png"));
                        row.RelativeItem(60)
                            .AlignCenter()
                            .PaddingTop(20)
                            .Text("Informe de stock en sucursal")
                            .SemiBold().FontSize(18).FontColor(Colors.Black);
                        row.RelativeItem(30)
                            .AlignRight()
                            .Text($"Fecha : {DateTime.Now:dd/MM/yyyy}")
                            .SemiBold().FontSize(9)
                            .FontColor(new Color(0x9C94A7));
                    });

                    
                    page.Content().Padding(25).Column(column =>
                    {
                        column.Item().Text($"Emisor : {nameEmployee}");
                        column.Item().Text($"Bodega : {nameBodega}");
                        column.Item().Height(10);

                        column.Item().Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();

                                 if (nametipoBodega == "central")
                                    columns.RelativeColumn();
                            });

                            
                            table.Header(header =>
                            {
                                header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Codigo");
                                header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Producto");
                                header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Cantidad");
                                  if (nametipoBodega == "central")
                                    header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Bodega");
                                header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Precio Compra");
                                header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Precio Venta");
                            });

                            table.Cell().ColumnSpan(5).Height(5);
                              if (nametipoBodega == "central")
                                table.Cell().ColumnSpan(6).Height(5);

                            int rowIndex = 0;
                            foreach (var prod in informeProd)
                            {
                                var backgroundColor = rowIndex % 2 == 0 ? Colors.White : Colors.Grey.Lighten2;

                                table.Cell().Background(backgroundColor).Padding(3).Text($"{prod.codigo}");
                                table.Cell().Background(backgroundColor).Padding(3).Text($"{prod.prodName}");
                                table.Cell().Background(backgroundColor).Padding(3).AlignCenter().Text($"{prod.cantidad}");
                                  if (nametipoBodega == "central")
                                    table.Cell().Background(backgroundColor).Padding(3).Text($"{prod.nomBodega}");
                                table.Cell().Background(backgroundColor).Padding(3).PaddingLeft(5).AlignRight().Text($"${prod.compra}");
                                table.Cell().Background(backgroundColor).Padding(3).PaddingLeft(5).AlignRight().Text($"${prod.venta}");

                                rowIndex++;
                            }
                        });
                    });
                });
            });

            return report;
        }
        public static Document GetEmpleados(List<InformeEmpleado> informeEmpleado, int bodegaid, string nameEmployee, string nameBodega,string nametipoBodega)
        {
            var report = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(20);
                    page.Size(PageSizes.A4);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(10));

                    
                    page.Header().Row(row =>
                    {
                        row.RelativeItem(30)
                            .AlignLeft()
                            .Height(60)
                             .Image(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/icono_negro_rojo.png"));
                        row.RelativeItem(60)
                            .AlignCenter()
                            .PaddingTop(20)
                            .Text("Lista de Empleados")
                            .SemiBold().FontSize(18).FontColor(Colors.Black);
                        row.RelativeItem(30)
                            .AlignRight()
                            .Text($"Fecha : {DateTime.Now:dd/MM/yyyy}")
                            .SemiBold().FontSize(9)
                            .FontColor(new Color(0x9C94A7));
                    });

                    
                    page.Content().Padding(25).Column(column =>
                    {
                        column.Item().Text($"Emisor : {nameEmployee}");
                        column.Item().Text($"Bodega : {nameBodega}");
                        column.Item().Height(20); // Espacio

                        column.Item().Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                 if (nametipoBodega == "central")
                                    columns.RelativeColumn();
                            });

                            
                            table.Header(header =>
                            {
                                  if (nametipoBodega == "central")
                                    header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Bodega");
                                header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Nombre");
                                header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Email");
                                header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Puesto de trabajo");
                            });

                            table.Cell().ColumnSpan(3).Height(5);
                            if (nametipoBodega == "central")
                                table.Cell().ColumnSpan(4).Height(5);

                            int rowIndex = 0;
                            foreach (var employee in informeEmpleado)
                            {
                                var backgroundColor = rowIndex % 2 == 0 ? Colors.White : Colors.Grey.Lighten2;

                                  if (nametipoBodega == "central")
                                    table.Cell().Background(backgroundColor).Padding(3).Text($"{employee.nameBodega}");
                                table.Cell().Background(backgroundColor).Padding(3).Text($"{employee.nameUsuario}" + $" {employee.apellido}");
                                table.Cell().Background(backgroundColor).Padding(3).Text($"{employee.email}");
                                table.Cell().Background(backgroundColor).Padding(3).Text($"{employee.nameRol}");

                                rowIndex++;
                            }
                        });
                    });
                });
            });

            return report;
        }
        public static Document GetBodega(List<InformeBodega> informeBodega, string nameEmployee, string nameBodega)
        {
            var report = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(20);
                    page.Size(PageSizes.A4);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(10));

                    
                    page.Header().Row(row =>
                    {
                        row.RelativeItem(30)
                            .AlignLeft()
                            .Height(60)
                             .Image(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/icono_negro_rojo.png"));
                        row.RelativeItem(60)
                            .AlignCenter()
                            .PaddingTop(20)
                            .Text("Informe Bodegas")
                            .SemiBold().FontSize(18).FontColor(Colors.Black);
                        row.RelativeItem(30)
                            .AlignRight()
                            .Text($"Fecha : {DateTime.Now:dd/MM/yyyy}")
                            .SemiBold().FontSize(9)
                            .FontColor(new Color(0x9C94A7));
                    });

                    
                    page.Content().Padding(25).Column(column =>
                    {
                        column.Item().Text($"Emisor : {nameEmployee}");
                        column.Item().Text($"Bodega : {nameBodega}");
                        column.Item().Height(20); // Espacio

                        column.Item().Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                            });

                            
                            table.Header(header =>
                            {
                                header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Nombre");
                                header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Direccion");
                                header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Tipo Bodega");
                            });

                            table.Cell().ColumnSpan(3).Height(5);

                            int rowIndex = 0;
                            foreach (var Bod in informeBodega)
                            {
                                var backgroundColor = rowIndex % 2 == 0 ? Colors.White : Colors.Grey.Lighten2;

                                table.Cell().Background(backgroundColor).Padding(3).Text($"{Bod.nameBodegas}");
                                table.Cell().Background(backgroundColor).Padding(3).Text($"{Bod.direccion}");
                                table.Cell().Background(backgroundColor).Padding(3).Text($"{Bod.tipoBodega}");

                                rowIndex++;
                            }
                        });
                    });
                });
            });

            return report;
        }
        public static Document GetAuditoria(List<DataAuditor> informeAuditor, string nameEmployee, string nameBodega, int bodegaid, string nametipoBodega)
        {
            var report = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(20);
                    page.Size(PageSizes.A4);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(10));

                    
                    page.Header().Row(row =>
                    {
                        row.RelativeItem(30)
                            .AlignLeft()
                            .Height(60)
                            .Image(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/icono_negro_rojo.png"));
                        row.RelativeItem(60)
                            .AlignCenter()
                            .PaddingTop(20)
                            .Text("Informe de stock en sucursal")
                            .SemiBold().FontSize(18).FontColor(Colors.Black);
                        row.RelativeItem(30)
                            .AlignRight()
                            .Text($"Fecha : {DateTime.Now:dd/MM/yyyy}")
                            .SemiBold().FontSize(9)
                            .FontColor(new Color(0x9C94A7));
                    });

                    
                    page.Content().Padding(25).Column(column =>
                    {
                        column.Item().Text($"Emisor : {nameEmployee}");
                        column.Item().Text($"Bodega : {nameBodega}");
                        column.Item().Height(10);

                        column.Item().Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();

                                  if (nametipoBodega == "central")
                                    columns.RelativeColumn();
                            });

                            
                            table.Header(header =>
                            {
                                header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("nombre");
                                  if (nametipoBodega == "central")
                                    header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Bodega");
                                header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Descripción");
                                header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Fecha");
                            });

                            table.Cell().ColumnSpan(3).Height(5);
                              if (nametipoBodega == "central")
                                table.Cell().ColumnSpan(4).Height(5);

                            int rowIndex = 0;
                            foreach (var aud in informeAuditor)
                            {
                                var backgroundColor = rowIndex % 2 == 0 ? Colors.White : Colors.Grey.Lighten2;

                                table.Cell().Background(backgroundColor).Padding(3).Text($"{aud.nameUsu} "+$"{aud.apellido}");
                                  if (nametipoBodega == "central")
                                    table.Cell().Background(backgroundColor).Padding(3).Text($"{aud.nameBodega}");
                                table.Cell().Background(backgroundColor).Padding(3).PaddingLeft(5).AlignRight().Text($"{aud.detalle}");
                                table.Cell().Background(backgroundColor).Padding(3).PaddingLeft(5).AlignRight().Text($"{aud.fechaAud}");

                                rowIndex++;
                            }
                        });
                    });
                });
            });

            return report;
        }
        public static Document GetAuditoria(List<DataPerdida> informePerdida, string nameEmployee, string nameBodega, int bodegaid, string nametipoBodega)
        {
            var report = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(20);
                    page.Size(PageSizes.A4);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(10));

                    
                    page.Header().Row(row =>
                    {
                        row.RelativeItem(30)
                            .AlignLeft()
                            .Height(60)
                            .Image(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/icono_negro_rojo.png"));
                        row.RelativeItem(60)
                            .AlignCenter()
                            .PaddingTop(20)
                            .Text("Informe de stock en sucursal")
                            .SemiBold().FontSize(18).FontColor(Colors.Black);
                        row.RelativeItem(30)
                            .AlignRight()
                            .Text($"Fecha : {DateTime.Now:dd/MM/yyyy}")
                            .SemiBold().FontSize(9)
                            .FontColor(new Color(0x9C94A7));
                    });

                    
                    page.Content().Padding(25).Column(column =>
                    {
                        column.Item().Text($"Emisor : {nameEmployee}");
                        column.Item().Text($"Bodega : {nameBodega}");
                        column.Item().Height(10);

                        column.Item().Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();

                                  if (nametipoBodega == "central")
                                    columns.RelativeColumn();
                            });

                            
                            table.Header(header =>
                            {
                                  if (nametipoBodega == "central")
                                    header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Bodega");
                                header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Producto");
                                header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Cantidad");
                                header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Tipo perdida");
                                header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Detalle");
                                header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("fecha");
                            });

                            table.Cell().ColumnSpan(5).Height(5);
                              if (nametipoBodega == "central")
                                table.Cell().ColumnSpan(6).Height(5);

                            int rowIndex = 0;
                            foreach (var per in informePerdida)
                            {
                                var backgroundColor = rowIndex % 2 == 0 ? Colors.White : Colors.Grey.Lighten2;

                                  if (nametipoBodega == "central")
                                    table.Cell().Background(backgroundColor).Padding(3).Text($"{per.nameBodega}");
                                table.Cell().Background(backgroundColor).Padding(3).PaddingLeft(5).AlignRight().Text($"{per.nameProd}");
                                table.Cell().Background(backgroundColor).Padding(3).PaddingLeft(5).AlignRight().Text($"{per.cantida}");
                                table.Cell().Background(backgroundColor).Padding(3).PaddingLeft(5).AlignRight().Text($"{per.TipoPerdida}");
                                table.Cell().Background(backgroundColor).Padding(3).PaddingLeft(5).AlignRight().Text($"{per.detalle}");
                                table.Cell().Background(backgroundColor).Padding(3).PaddingLeft(5).AlignRight().Text($"{per.fechaReg}");

                                rowIndex++;
                            }
                        });
                    });
                });
            });

            return report;
        }
        public static Document GetTransferencia(List<DataTransfecerencia> infoTransferencia, string nameEmployee, string nameBodega, int bodegaid, string nametipoBodega)
        {
            var report = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(20);
                    page.Size(PageSizes.A4);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(10));

                    
                    page.Header().Row(row =>
                    {
                        row.RelativeItem(30)
                            .AlignLeft()
                            .Height(60)
                            .Image(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/icono_negro_rojo.png"));
                        row.RelativeItem(60)
                            .AlignCenter()
                            .PaddingTop(20)
                            .Text("Ficha Transferencia de productos")
                            .SemiBold().FontSize(18).FontColor(Colors.Black);
                        row.RelativeItem(30)
                            .AlignRight()
                            .Text($"Fecha : {DateTime.Now:dd/MM/yyyy}")
                            .SemiBold().FontSize(9)
                            .FontColor(new Color(0x9C94A7));
                    });

                    
                    page.Content().Padding(25).Column(column =>
                    {
                        column.Item().Text($"Emisor : {nameEmployee}");
                        column.Item().Text($"Bodega : {nameBodega}");
                        column.Item().Height(10);

                        var groupedItems = infoTransferencia.GroupBy(item => item.secret).ToList();
                        foreach (var group in groupedItems)
                        {
                            var firstItem = group.First(); 

                            column.Item().Row(row =>
                            {
                                row.RelativeItem().Text($"Fecha envío : {firstItem.FechaEnvio}");
                                row.RelativeItem().AlignCenter().Text($"Estado : {firstItem.Estado}");
                                row.RelativeItem().AlignRight().Text($"Código verificación: {firstItem.secret}").Bold();
                            });
                            column.Item().Text($"Bodega destino : {firstItem.BodegaDestino}");
                            column.Item().Height(5);
                            column.Item().Text($"Observación : {firstItem.Detalle}");
                        }
                        column.Item().Height(15);

                        column.Item().Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn(0.2f);
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();

                            });

                            
                            table.Header(header =>
                            {
                                header.Cell().BorderTop(1).BorderBottom(1).AlignCenter().Padding(3).Text("#");
                                header.Cell().BorderTop(1).BorderBottom(1).AlignCenter().Padding(3).Text("Nombre");
                                header.Cell().BorderTop(1).BorderBottom(1).AlignCenter().Padding(3).Text("Codigo");
                                header.Cell().BorderTop(1).BorderBottom(1).AlignCenter().Padding(3).Text("Precio Compra");
                                header.Cell().BorderTop(1).BorderBottom(1).AlignCenter().Padding(3).Text("Cantidad despachada");
                                header.Cell().BorderTop(1).BorderBottom(1).AlignCenter().Padding(3).Text("Cantidad recibida");
                                header.Cell().BorderTop(1).BorderBottom(1).AlignCenter().Padding(3).Text("Cantidad dañada");
                                header.Cell().BorderTop(1).BorderBottom(1).AlignCenter().Padding(3).Text("Cantidad perdida");
                            });

                            table.Cell().ColumnSpan(8).Height(5);

                            int rowIndex = 0;
                            int numero = 1;
                            foreach (var trf in infoTransferencia)
                            {
                                var backgroundColor = rowIndex % 2 == 0 ? Colors.White : Colors.Grey.Lighten2;

                                
                                table.Cell().Background(backgroundColor).Padding(3).PaddingLeft(5).Text($"{numero}");
                                table.Cell().Background(backgroundColor).Padding(3).PaddingLeft(5).Text($"{trf.Producto}");
                                table.Cell().Background(backgroundColor).Padding(3).PaddingLeft(5).Text($"{trf.codigo}");
                                table.Cell().Background(backgroundColor).Padding(3).PaddingLeft(5).AlignRight().Text($"${trf.Compra}");
                                table.Cell().Background(backgroundColor).Padding(3).PaddingLeft(5).AlignRight().Text($"{trf.Cantidad}");
                                table.Cell().Background(backgroundColor).Padding(3).PaddingLeft(5).AlignRight().Text($"{trf.CantResibido}");
                                table.Cell().Background(backgroundColor).Padding(3).PaddingLeft(5).AlignRight().Text($"{trf.Dañado}");
                                table.Cell().Background(backgroundColor).Padding(3).PaddingLeft(5).AlignRight().Text($"{trf.Perdido}");

                                rowIndex++;
                                numero++;
                            }
                        });
                    });
                });
            });

            return report;
        }
        public static Document GetCompraDetalle(List<DetallesCompra> infoDetalleCompra)
        {
            var report = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(20);
                    page.Size(PageSizes.A4);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(10));


                    page.Header().Row(row =>
                    {
                        row.RelativeItem(30)
                            .AlignLeft()
                            .Height(60)
                            .Image(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/icono_negro_rojo.png"));
                        row.RelativeItem(60)
                            .AlignCenter()
                            .PaddingTop(20)
                            .Text("Detalle de Compra")
                            .SemiBold().FontSize(18).FontColor(Colors.Black);
                        row.RelativeItem(30)
                            .AlignRight()
                            .Text($"Fecha : {DateTime.Now:dd/MM/yyyy}")
                            .SemiBold().FontSize(9)
                            .FontColor(new Color(0x9C94A7));
                    });


                    page.Content().Padding(25).Column(column =>
                    {
                        column.Item().Height(10);

                        var groupedItems = infoDetalleCompra.GroupBy(item => item.CompraId);
                        foreach (var group in groupedItems)
                        {
                            var firstItem = group.First();

                            column.Item().Row(row =>
                            {
                                row.RelativeItem().Text($"Distribuidor : {firstItem.Distribuidor}");
                                row.RelativeItem().AlignCenter().Text($"Fecha Compra : {firstItem.Fecha}");
                            });
                            column.Item().Height(5);
                            column.Item().Text($"Observación : {firstItem.Detalle}");
                        }
                        column.Item().Height(15);

                        column.Item().Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.ConstantColumn(50);
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();

                            });


                            table.Header(header =>
                            {
                                header.Cell().BorderTop(1).BorderBottom(1).AlignCenter().Padding(3).Text("#");
                                header.Cell().BorderTop(1).BorderBottom(1).AlignCenter().Padding(3).Text("Nombre");
                                header.Cell().BorderTop(1).BorderBottom(1).AlignCenter().Padding(3).Text("Codigo");
                                header.Cell().BorderTop(1).BorderBottom(1).AlignCenter().Padding(3).Text("Precio Compra");
                                header.Cell().BorderTop(1).BorderBottom(1).AlignCenter().Padding(3).Text("Cantidad");
                            });

                            table.Cell().ColumnSpan(5).Height(5);

                            int rowIndex = 0;
                            int numero = 1;
                            foreach (var trf in infoDetalleCompra)
                            {
                                var backgroundColor = rowIndex % 2 == 0 ? Colors.White : Colors.Grey.Lighten2;


                                table.Cell().Background(backgroundColor).Padding(3).AlignCenter().PaddingLeft(5).Text($"{numero}");
                                table.Cell().Background(backgroundColor).Padding(3).PaddingLeft(5).Text($"{trf.Nombre}");
                                table.Cell().Background(backgroundColor).Padding(3).PaddingLeft(5).Text($"{trf.Codigo}");
                                table.Cell().Background(backgroundColor).Padding(3).PaddingLeft(5).AlignRight().Text($"${trf.PrecioCompra}");
                                table.Cell().Background(backgroundColor).Padding(3).PaddingLeft(5).AlignRight().Text($"{trf.Cantidad}");

                                rowIndex++;
                                numero++;
                            }
                        });
                    });
                });
            });

            return report;
        }

        public static Document GetTransferenciaIntegracion(List<DataTransfecerencia> infoTransferencia, string nameBodega, int bodegaid, string nametipoBodega)
        {
            var report = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(20);
                    page.Size(PageSizes.A4);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(10));


                    page.Header().Row(row =>
                    {
                        row.RelativeItem(30)
                            .AlignLeft()
                            .Height(60)
                            .Image(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/icono_negro_rojo.png"));
                        row.RelativeItem(60)
                            .AlignCenter()
                            .PaddingTop(20)
                            .Text("Ficha Transferencia de productos")
                            .SemiBold().FontSize(18).FontColor(Colors.Black);
                        row.RelativeItem(30)
                            .AlignRight()
                            .Text($"Fecha : {DateTime.Now:dd/MM/yyyy}")
                            .SemiBold().FontSize(9)
                            .FontColor(new Color(0x9C94A7));
                    });


                    page.Content().Padding(25).Column(column =>
                    {
                        column.Item().Text($"Bodega : {nameBodega}");
                        column.Item().Height(10);

                        var groupedItems = infoTransferencia.GroupBy(item => item.secret).ToList();
                        foreach (var group in groupedItems)
                        {
                            var firstItem = group.First();

                            column.Item().Row(row =>
                            {
                                row.RelativeItem().Text($"Fecha envío : {firstItem.FechaEnvio}");
                                row.RelativeItem().AlignCenter().Text($"Estado : {firstItem.Estado}");
                            });
                            column.Item().Height(5);
                            column.Item().Text($"Observación : {firstItem.Detalle}");
                        }
                        column.Item().Height(15);

                        column.Item().Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn(0.2f);
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();

                            });


                            table.Header(header =>
                            {
                                header.Cell().BorderTop(1).BorderBottom(1).AlignCenter().Padding(3).Text("#");
                                header.Cell().BorderTop(1).BorderBottom(1).AlignCenter().Padding(3).Text("Nombre");
                                header.Cell().BorderTop(1).BorderBottom(1).AlignCenter().Padding(3).Text("Codigo");
                                header.Cell().BorderTop(1).BorderBottom(1).AlignCenter().Padding(3).Text("Precio Compra");
                                header.Cell().BorderTop(1).BorderBottom(1).AlignCenter().Padding(3).Text("Cantidad despachada");
                                header.Cell().BorderTop(1).BorderBottom(1).AlignCenter().Padding(3).Text("Cantidad recibida");
                                header.Cell().BorderTop(1).BorderBottom(1).AlignCenter().Padding(3).Text("Cantidad dañada");
                                header.Cell().BorderTop(1).BorderBottom(1).AlignCenter().Padding(3).Text("Cantidad perdida");
                            });

                            table.Cell().ColumnSpan(8).Height(5);

                            int rowIndex = 0;
                            int numero = 1;
                            foreach (var trf in infoTransferencia)
                            {
                                var backgroundColor = rowIndex % 2 == 0 ? Colors.White : Colors.Grey.Lighten2;


                                table.Cell().Background(backgroundColor).Padding(3).PaddingLeft(5).Text($"{numero}");
                                table.Cell().Background(backgroundColor).Padding(3).PaddingLeft(5).Text($"{trf.Producto}");
                                table.Cell().Background(backgroundColor).Padding(3).PaddingLeft(5).Text($"{trf.codigo}");
                                table.Cell().Background(backgroundColor).Padding(3).PaddingLeft(5).AlignRight().Text($"${trf.Compra}");
                                table.Cell().Background(backgroundColor).Padding(3).PaddingLeft(5).AlignRight().Text($"{trf.Cantidad}");
                                table.Cell().Background(backgroundColor).Padding(3).PaddingLeft(5).AlignRight().Text($"{trf.CantResibido}");
                                table.Cell().Background(backgroundColor).Padding(3).PaddingLeft(5).AlignRight().Text($"{trf.Dañado}");
                                table.Cell().Background(backgroundColor).Padding(3).PaddingLeft(5).AlignRight().Text($"{trf.Perdido}");

                                rowIndex++;
                                numero++;
                            }
                        });
                    });
                });
            });

            return report;
        }
        public static Document generatePdfQuestProductoIntegracion(List<InformeProducto> informeProd, int bodegaid, string nameBodega, string nametipoBodega)
        {
            var report = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(20);
                    page.Size(PageSizes.A4);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(10));


                    page.Header().Row(row =>
                    {
                        row.RelativeItem(30)
                            .AlignLeft()
                            .Height(60)
                            .Image(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/icono_negro_rojo.png"));
                        row.RelativeItem(60)
                            .AlignCenter()
                            .PaddingTop(20)
                            .Text("Informe de stock en sucursal")
                            .SemiBold().FontSize(18).FontColor(Colors.Black);
                        row.RelativeItem(30)
                            .AlignRight()
                            .Text($"Fecha : {DateTime.Now:dd/MM/yyyy}")
                            .SemiBold().FontSize(9)
                            .FontColor(new Color(0x9C94A7));
                    });


                    page.Content().Padding(25).Column(column =>
                    {
                        column.Item().Text($"Bodega : {nameBodega}");
                        column.Item().Height(10);

                        column.Item().Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();

                                if (nametipoBodega == "central")
                                    columns.RelativeColumn();
                            });


                            table.Header(header =>
                            {
                                header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Codigo");
                                header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Producto");
                                header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Cantidad");
                                if (nametipoBodega == "central")
                                    header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Bodega");
                                header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Precio Compra");
                                header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Precio Venta");
                            });

                            table.Cell().ColumnSpan(5).Height(5);
                            if (nametipoBodega == "central")
                                table.Cell().ColumnSpan(6).Height(5);

                            int rowIndex = 0;
                            foreach (var prod in informeProd)
                            {
                                var backgroundColor = rowIndex % 2 == 0 ? Colors.White : Colors.Grey.Lighten2;

                                table.Cell().Background(backgroundColor).Padding(3).Text($"{prod.codigo}");
                                table.Cell().Background(backgroundColor).Padding(3).Text($"{prod.prodName}");
                                table.Cell().Background(backgroundColor).Padding(3).AlignCenter().Text($"{prod.cantidad}");
                                if (nametipoBodega == "central")
                                    table.Cell().Background(backgroundColor).Padding(3).Text($"{prod.nomBodega}");
                                table.Cell().Background(backgroundColor).Padding(3).PaddingLeft(5).AlignRight().Text($"${prod.compra}");
                                table.Cell().Background(backgroundColor).Padding(3).PaddingLeft(5).AlignRight().Text($"${prod.venta}");

                                rowIndex++;
                            }
                        });
                    });
                });
            });

            return report;
        }
    }
}