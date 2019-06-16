USE [master]
GO

/* DATABASE: HCSearch */
/* **** MUST SET FILE LOCATION ****
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'HCSearch')
BEGIN
CREATE DATABASE [HCSearch]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'HCSearch', FILENAME = N'C:\Users\CBrown\source\repos\HC\HCSearch\Data\HCSearch.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'HCSearch_log', FILENAME = N'C:\Users\CBrown\source\repos\HC\HCSearch\Data\HCSearch_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
END
GO
*/

IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [HCSearch].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO


USE [HCSearch]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

GRANT CREATE FULLTEXT CATALOG TO [public] AS [dbo]
GO
GRANT REFERENCES TO [public] AS [dbo]
GO

/* TABLE: Persons */
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Persons]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Persons](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[NameFirst] [nvarchar](255) NOT NULL,
	[NameLast] [nvarchar](255) NOT NULL,
	[AddressStreet] [nvarchar](255) NULL,
	[AddressCity] [nvarchar](255) NULL,
	[AddressState] [nvarchar](255) NULL,
	[AddressZip] [nvarchar](50) NULL,
	[AddressCountry] [nvarchar](255) NULL,
	[DateOfBirth] [datetime2](7) NOT NULL,
	[Interests] [nvarchar](4000) NULL,
	[Picture] [varbinary](max) NULL,
 CONSTRAINT [PK_Persons] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO

/* INDEX: ui_names */
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID(N'[dbo].[Persons]') AND name = N'ui_names')
CREATE UNIQUE NONCLUSTERED INDEX [ui_names] ON [dbo].[Persons]
(
	[Id] ASC
)
INCLUDE ([NameFirst], [NameLast])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO

/* FULLTEXT CATALOG: HCFullTextCatalog */
IF NOT EXISTS (SELECT * FROM sysfulltextcatalogs ftc WHERE ftc.name = N'HCFullTextCatalog')
CREATE FULLTEXT CATALOG [HCFullTextCatalog] WITH ACCENT_SENSITIVITY = OFF
AS DEFAULT
GO

/* FULLTEXT INDEX: FullTextIndex */
IF not EXISTS (SELECT * FROM sys.fulltext_indexes fti WHERE fti.object_id = OBJECT_ID(N'[dbo].[Persons]'))
CREATE FULLTEXT INDEX ON [dbo].[Persons](
[NameFirst] LANGUAGE 'English', 
[NameLast] LANGUAGE 'English')
KEY INDEX [ui_names] ON ([HCFullTextCatalog], FILEGROUP [PRIMARY])
WITH (CHANGE_TRACKING = AUTO, STOPLIST = SYSTEM)
GO