using System;
using System.Collections.Generic;
using System.Text;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using DbEntities;

namespace MyProject.DanhMuc.Person2.Dtos
{
    [AutoMap(typeof(Person))]
    public class PersonDto : EntityDto<int>
    {
        public virtual string Name { get; set; }

        public virtual string FullName { get; set; }

        public virtual string Email { get; set; }

        //public virtual int? DropdownSingle { get; set; }

        //public virtual int? AutoCompleteSingle { get; set; }
    }
}
