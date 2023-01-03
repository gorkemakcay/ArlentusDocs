using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    public partial class root_post_seed_to_db : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Header",
                table: "Posts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2023, 1, 3, 13, 32, 53, 868, DateTimeKind.Local).AddTicks(3950));

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2023, 1, 3, 13, 32, 53, 868, DateTimeKind.Local).AddTicks(3252));

            migrationBuilder.InsertData(
                table: "Posts",
                columns: new[] { "Id", "Context", "ContextPath", "CreatedBy", "CreatedDate", "Header", "IsActive", "IsDeleted", "ParentId", "UpdatedDate" },
                values: new object[] { 1, null, "wwwroot\\Posts\\202301030000000_Admin.txt", "Admin", new DateTime(2023, 1, 3, 12, 0, 0, 0, DateTimeKind.Local).AddTicks(6434), "Root", true, false, 0, null });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.AlterColumn<string>(
                name: "Header",
                table: "Posts",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2022, 12, 22, 16, 44, 3, 107, DateTimeKind.Local).AddTicks(1005));

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2022, 12, 22, 16, 44, 3, 107, DateTimeKind.Local).AddTicks(746));
        }
    }
}
