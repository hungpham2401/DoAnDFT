namespace DbEntities
{
    using System;
    using System.ComponentModel.DataAnnotations.Schema;
    using Abp.Domain.Entities;
    using Abp.Domain.Entities.Auditing;

    [Table("TheDevBlog")]
    public class TheDevBlog : FullAuditedEntity
    {
        public virtual int? Id { get; set; }

        public virtual string Title { get; set; }

        public virtual string Content { get; set; }

        public virtual string Summary { get; set; }

        public virtual string UrlHandle { get; set; }

        public virtual string Feutture { get; set; }

        public virtual bool Visiable { get; set; }

        public virtual string Author { get; set; }

        public virtual DateTime PubLishDate { get; set; }

        public virtual DateTime UPdateDate { get; set; }
    }
}