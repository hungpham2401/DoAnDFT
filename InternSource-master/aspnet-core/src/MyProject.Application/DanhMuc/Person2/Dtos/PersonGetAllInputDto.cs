using Abp.Application.Services.Dto;

namespace MyProject.DanhMuc.Person2.Dtos
{
    public class PersonGetAllInputDto : PagedResultRequestDto
    {
        public string Keyword { get; set; }
    }
}
