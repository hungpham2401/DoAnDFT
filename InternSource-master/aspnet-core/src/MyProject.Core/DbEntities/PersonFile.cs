using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DbEntities
{
    [Table("PersonFile")]
    public class PersonFile : FullAuditedEntity, IMayHaveTenant
    {
        public int? TenantId { get; set; }

        //public virtual int? PersonId { get; set; }

        public virtual string TenFile { get; set; }

        public virtual string LinkFile { get; set; }

        public virtual int? LoaiFile { get; set; }

        public virtual string GhiChu { get; set; }
    }
}