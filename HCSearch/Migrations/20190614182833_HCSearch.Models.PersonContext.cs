using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace HCSearch.Migrations
{
    public partial class HCSearchModelsPersonContext : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PersonInfos",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    AddressStreet = table.Column<string>(maxLength: 255, nullable: true),
                    AddressCity = table.Column<string>(maxLength: 255, nullable: true),
                    AddressState = table.Column<string>(maxLength: 255, nullable: true),
                    AddressCountry = table.Column<string>(maxLength: 255, nullable: true),
                    DateOfBirth = table.Column<DateTime>(nullable: false),
                    Interests = table.Column<string>(maxLength: 4000, nullable: true),
                    Picture = table.Column<byte[]>(type: "varbinary(Max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PersonInfos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PersonNames",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    PersonInfoFK = table.Column<int>(nullable: false),
                    NameFirst = table.Column<string>(maxLength: 255, nullable: true),
                    NameLast = table.Column<string>(maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PersonNames", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PersonInfos");

            migrationBuilder.DropTable(
                name: "PersonNames");
        }
    }
}
