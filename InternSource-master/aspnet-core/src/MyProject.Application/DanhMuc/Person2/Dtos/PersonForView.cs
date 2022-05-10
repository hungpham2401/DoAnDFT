using System;
using System.Collections.Generic;
using System.Text;

namespace MyProject.DanhMuc.Person2.Dtos
{
    public class PersonForView
    {
        public PersonDto Person { get; set; }

        public string TrangThai { get; set; }

        public string TrangThaiDuyet { get; set; }
    }
}
