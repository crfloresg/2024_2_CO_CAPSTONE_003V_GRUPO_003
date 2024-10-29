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

    public static Document generatePdfQuestProducto(List<InformeProducto> informeProd,int bodegaid,string nameEmployee,string nameBodega)
        {
            var report = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(20);
                    page.Size(PageSizes.A4);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(10));

                    // Encabezado
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

                    // Contenido
                    page.Content().Padding(25).Column(column =>
                    {
                        column.Item().Text($"Emisor : {nameEmployee}");
                        column.Item().Text($"Bodega : {nameBodega}");
                        column.Item().Height(10); // Espacio

                        column.Item().Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                if (bodegaid == 3)
                                {
                                    columns.RelativeColumn();
                                    columns.RelativeColumn();
                                    columns.RelativeColumn();
                                    columns.RelativeColumn();
                                    columns.RelativeColumn();
                                    columns.RelativeColumn();
                                }
                                else
                                {
                                    columns.RelativeColumn();
                                    columns.RelativeColumn();
                                    columns.RelativeColumn();
                                    columns.RelativeColumn();
                                    columns.RelativeColumn();
                                }
                            });

                            // Encabezado de la tabla
                            table.Header(header =>
                            {
                                
                                if (bodegaid == 3)
                                {
                                    header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Id Producto");
                                    header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Codigo");
                                    header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Producto");
                                    header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Cantidad");
                                    header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Bodega");
                                    header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Precio Venta");                                    
                                }
                                else
                                {
                                    header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Id Producto");
                                    header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Codigo");
                                    header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Producto");
                                    header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Cantidad");
                                    header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Precio Venta");
                                }
                            });
                            table.Cell().ColumnSpan(5).Height(5);
                            if (bodegaid == 3)
                                table.Cell().ColumnSpan(6).Height(5);

                            foreach (var prod in informeProd)
                            {
                                if(bodegaid == 3)
                                {
                                    table.Cell().PaddingLeft(5).Text($"{prod.prodId}");
                                    table.Cell().Text($"{prod.codigo}");
                                    table.Cell().Text($"{prod.prodName}");
                                    table.Cell().Text($"{prod.cantidad}");
                                    table.Cell().Text($"{prod.nomBodega}");
                                    table.Cell().PaddingLeft(5).AlignRight().Text($"${prod.venta}");                                    
                                }
                                else
                                {
                                    table.Cell().Text($"{prod.prodId}");
                                    table.Cell().Text($"{prod.codigo}");
                                    table.Cell().Text($"{prod.prodName}");
                                    table.Cell().Text($"{prod.cantidad}");
                                    table.Cell().AlignRight().Text($"${prod.venta}");
                                }

                            }
                        });
                    });
                });
            });

            return report;
        }

        public static Document GetEmpleados(List<InformeEmpleado> informeEmpleado, int bodegaid, string nameEmployee, string nameBodega)
        {
            var report = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(20);
                    page.Size(PageSizes.A4);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(10));

                    // Encabezado
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

                    // Contenido
                    page.Content().Padding(25).Column(column =>
                    {
                        column.Item().Text($"Emisor : {nameEmployee}");
                        column.Item().Text($"Bodega : {nameBodega}");
                        column.Item().Height(20); // Espacio

                        column.Item().Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                if (bodegaid == 3)
                                {
                                    columns.RelativeColumn();
                                    columns.RelativeColumn();
                                    columns.RelativeColumn();
                                    columns.RelativeColumn();
                                }
                                else
                                {
                                    columns.RelativeColumn();
                                    columns.RelativeColumn();
                                    columns.RelativeColumn();
                                }
                            });

                            // Encabezado de la tabla
                            table.Header(header =>
                            {

                                if (bodegaid == 3)
                                {
                                    header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Bodega");
                                    header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Nombre");
                                    header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Email");
                                    header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Puesto de trabajo");
                                }
                                else
                                {
                                    header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Nombre");
                                    header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Email");
                                    header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Puesto de trabajo");
                                }
                            });
                            table.Cell().ColumnSpan(3).Height(5);
                            if (bodegaid == 3)
                                table.Cell().ColumnSpan(4).Height(5);

                            foreach (var employee in informeEmpleado)
                            {
                                if (bodegaid == 3)
                                {
                                    table.Cell().Text($"{employee.nameBodega}");
                                    table.Cell().Text($"{employee.nameUsuario}" + $" {employee.apellido}");
                                    table.Cell().Text($"{employee.email}");
                                    table.Cell().Text($"{employee.nameRol}");
                                }
                                else
                                {
                                    table.Cell().Text($"{employee.nameUsuario}" + $" {employee.apellido}");
                                    table.Cell().Text($"{employee.email}");
                                    table.Cell().Text($"{employee.nameRol}");
                                }

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

                    // Encabezado
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

                    // Contenido
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

                            // Encabezado de la tabla
                            table.Header(header =>
                            {
                                header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Nombre");
                                header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Direccion");
                                header.Cell().BorderTop(1).BorderBottom(1).Padding(3).Text("Tipo Bodega");
                            });

                            table.Cell().ColumnSpan(3).Height(5);

                            foreach (var Bod in informeBodega)
                            {
                               table.Cell().Text($"{Bod.nameBodegas}");
                               table.Cell().Text($"{Bod.direccion}");
                               table.Cell().Text($"{Bod.tipoBodega}");
                            }
                        });
                    });
                });
            });

            return report;
        }
    }
}