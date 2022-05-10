using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using MyProject.DanhMuc.Person2.Dtos;

namespace MyProject.DanhMuc.Person2
{
    public interface IPersonAppService
    {
        Task<PagedResultDto<PersonForView>> GetAllAsync(PersonGetAllInputDto input);

        Task<int> CreateOrEdit(PersonCreateInput input);

        Task<PersonCreateInput> GetForEditAsync(EntityDto input);

        Task Delete(EntityDto input);

    }
}
