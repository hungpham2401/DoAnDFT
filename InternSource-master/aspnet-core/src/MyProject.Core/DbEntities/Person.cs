namespace DbEntities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Text;
    using Abp.Domain.Entities;
    using Abp.Domain.Entities.Auditing;

    [Table("Person")]
    public class Person : FullAuditedEntity
    {
        public virtual string Name { get; set; }

        public virtual string FullName { get; set; }

        public virtual string Email { get; set; }

        //public virtual int? DropdownSingle { get; set; }

        //public virtual int? AutoCompleteSingle { get; set; }
        public virtual ICollection<PersonFile> ListPersonFile { get; set; }
    }
}
