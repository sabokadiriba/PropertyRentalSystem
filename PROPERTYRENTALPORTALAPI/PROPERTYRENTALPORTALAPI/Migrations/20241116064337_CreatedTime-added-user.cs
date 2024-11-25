using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PROPERTYRENTALPORTALAPI.Migrations
{
    /// <inheritdoc />
    public partial class CreatedTimeaddeduser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                table: "AspNetUsers",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedDate",
                table: "AspNetUsers");
        }
    }
}
