using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Abp.UI;
using AutoMapper;
using DbEntities;
using Microsoft.EntityFrameworkCore;
using MyProject.DanhMuc.Person2.Dtos;
using MyProject.Global;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;

namespace MyProject.DanhMuc.Person2
{
    public class PersonAppService : MyProjectAppServiceBase, IPersonAppService
    {
        private readonly IRepository<Person> PersonRepository;

        //dùng uploadfile
        //private readonly IAppFolders appFolders;

        public PersonAppService(
           IRepository<Person> personRepository,
           IAppFolders appFolders
           )
        {
            this.PersonRepository = personRepository;
            //this.appFolders = appFolders;
        }



        public async Task<PagedResultDto<PersonForView>> GetAllAsync(PersonGetAllInputDto input)
        {
            try
            {
                var filter = this.PersonRepository.GetAll()
                .WhereIf(input != null && !string.IsNullOrEmpty(input.Keyword), e => e.Name.Contains(input.Keyword) || e.FullName.Contains(input.Keyword));
                var totalCount = await filter.CountAsync();
                var query = from o in filter
                            select new PersonForView()
                            {
                                Person = this.ObjectMapper.Map<PersonDto>(o),
                                //TrangThai = o.DropdownSingle != null && GlobalModel.TrangThaiHieuLucSorted.ContainsKey((int)o.DropdownSingle) ? GlobalModel.TrangThaiHieuLucSorted[(int)o.DropdownSingle] : string.Empty,
                                //TrangThaiDuyet = o.AutoCompleteSingle != null && GlobalModel.TrangThaiDuyetSorted.ContainsKey((int)o.AutoCompleteSingle) ? GlobalModel.TrangThaiDuyetSorted[(int)o.AutoCompleteSingle] : string.Empty,

                            };
                var items = query.PageBy(input).ToList();
                return new PagedResultDto<PersonForView>
                {
                    TotalCount = totalCount,
                    Items = items,
                };
            }
            catch (System.Exception e)
            {

                throw e;
            }
            
        }
        //public Task<PagedResultDto<PersonForView>> GetAllAsync1(PersonGetAllInputDto input)
        //{
        //    var people = PersonRepository.GetAll()
        //        .WhereIf(
        //            !input.Keyword.IsNullOrEmpty(),
        //            p => p.Name.Contains(input.Keyword) ||
        //            p.FullName.Contains(input.Keyword) ||
        //            p.Email.Contains(input.Keyword)

        //        )
        //        .OrderBy(p => p.Name)
        //        .ThenBy(p => p.FullName).ToList();
        //    return new Task<PagedResultDto<PersonForView>>(ObjectMapper.Map<List<PersonForView>>(people));
        //}

        //thêm mới hoặc chỉnh sửa


        public async Task<int> CreateOrEdit(PersonCreateInput input)
        {
            try
            {
                if (input == null)
                {
                    throw new UserFriendlyException(StringResources.NullParameter);
                }

                input.Name = GlobalFunction.RegexFormat(input.Name);
                input.FullName = GlobalFunction.RegexFormat(input.FullName);
                input.Email = GlobalFunction.RegexFormat(input.Email);

                if (this.CheckExist(input.Name, input.Id))
                {
                    return 1;
                }

                // nếu là thêm mới
                if (input.Id == null || input.Id == 0)
                {
                    await this.Create(input);
                }
                else
                {
                    // là cập nhật
                    await this.Update(input);
                }

                return 0;
            }
            catch (System.Exception e)
            {

                throw  e;  
            }
            // check null input
           
        }

        public async Task<PersonCreateInput> GetForEditAsync(EntityDto input)
        {
            try
            {
                if (input == null)
                {
                    throw new UserFriendlyException(StringResources.NullParameter);
                }

                var person = this.PersonRepository.GetAllIncluding(e => e.ListPersonFile).First(e => e.Id == (int)input.Id);
                var edit = this.ObjectMapper.Map<PersonCreateInput>(person);
                return await Task.FromResult(edit);
            }
            catch (System.Exception e)
            {

                throw e;
            }
            
        }

        public async Task Delete(EntityDto input)
        {
            if (input == null)
            {
                throw new UserFriendlyException(StringResources.NullParameter);
            }

            await this.PersonRepository.DeleteAsync(input.Id);
        }

        private async Task Create(PersonCreateInput input)
        {
            var test = this.ObjectMapper.Map<Person>(input);
            await this.PersonRepository.InsertAndGetIdAsync(test);
        }

        private async Task Update(PersonCreateInput input)
        {
            var update = await this.PersonRepository.GetAsync((int)input.Id);
            this.ObjectMapper.Map(input, update);
        }

        private bool CheckExist(string Name, int? id)
        {
            Name = GlobalFunction.RegexFormat(Name);

            // Nếu query > 0 thì là bị trùng mã => return true
            var query = this.PersonRepository.GetAll().Where(e => e.Id == id)
                .WhereIf(id != null, e => e.Id != id).Count();
            return query > 0;
        }
    }
}