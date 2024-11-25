using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PROPERTYRENTALPORTALAPI.Migrations
{
    /// <inheritdoc />
    public partial class cicleremoved : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RentRequests_AspNetUsers_ApplicationUserId",
                table: "RentRequests");

            migrationBuilder.DropIndex(
                name: "IX_RentRequests_ApplicationUserId",
                table: "RentRequests");

            migrationBuilder.DropColumn(
                name: "ApplicationUserId",
                table: "RentRequests");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ApplicationUserId",
                table: "RentRequests",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_RentRequests_ApplicationUserId",
                table: "RentRequests",
                column: "ApplicationUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_RentRequests_AspNetUsers_ApplicationUserId",
                table: "RentRequests",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
