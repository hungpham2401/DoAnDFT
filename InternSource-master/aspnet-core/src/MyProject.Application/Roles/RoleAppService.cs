// This file is not generated, but this comment is necessary to exclude it from StyleCop analysis 
// <auto-generated/> 
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.IdentityFramework;
using Abp.Linq.Extensions;
using MyProject.Authorization;
using MyProject.Authorization.Roles;
using MyProject.Authorization.Users;
using MyProject.Roles.Dto;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using MyProject.Global.Dtos;

namespace MyProject.Roles
{
    [AbpAuthorize(PermissionNames.Pages_Roles)]
    public class RoleAppService : AsyncCrudAppService<Role, RoleDto, int, PagedRoleResultRequestDto, CreateRoleDto, RoleDto>, IRoleAppService
    {
        private readonly RoleManager _roleManager;
        private readonly UserManager _userManager;
        private readonly IRepository<Role> _roleRepository;

        public RoleAppService(IRepository<Role> repository, RoleManager roleManager, UserManager userManager, IRepository<Role> roleRepository)
            : base(repository)
        {
            _roleManager = roleManager;
            _userManager = userManager;
            _roleRepository = roleRepository;
        }

        public override async Task<RoleDto> CreateAsync(CreateRoleDto input)
        {
            CheckCreatePermission();

            var role = ObjectMapper.Map<Role>(input);
            role.SetNormalizedName();

            CheckErrors(await _roleManager.CreateAsync(role));

            var grantedPermissions = PermissionManager
                .GetAllPermissions()
                .Where(p => input.GrantedPermissions.Contains(p.Name))
                .ToList();

            await _roleManager.SetGrantedPermissionsAsync(role, grantedPermissions);

            return MapToEntityDto(role);
        }

        public async Task<ListResultDto<RoleListDto>> GetRolesAsync(GetRolesInput input)
        {
            var roles = await _roleManager
                .Roles
                .WhereIf(
                    !input.Permission.IsNullOrWhiteSpace(),
                    r => r.Permissions.Any(rp => rp.Name == input.Permission && rp.IsGranted)
                )
                .ToListAsync();

            return new ListResultDto<RoleListDto>(ObjectMapper.Map<List<RoleListDto>>(roles));
        }

        public override async Task<RoleDto> UpdateAsync(RoleDto input)
        {
            CheckUpdatePermission();

            var role = await _roleManager.GetRoleByIdAsync(input.Id);

            ObjectMapper.Map(input, role);

            CheckErrors(await _roleManager.UpdateAsync(role));

            var grantedPermissions = PermissionManager
                .GetAllPermissions()
                .Where(p => input.GrantedPermissions.Contains(p.Name))
                .ToList();

            await _roleManager.SetGrantedPermissionsAsync(role, grantedPermissions);

            return MapToEntityDto(role);
        }

        public int CheckExist(string roleName, string displayRoleName, long? id)
        {
            roleName = Global.GlobalFunction.RegexFormat(roleName);
            displayRoleName = Global.GlobalFunction.RegexFormat(displayRoleName);

            var userList = this._roleRepository.GetAll().Where(e => e.Name == roleName || e.DisplayName == displayRoleName)
                .WhereIf(id > 0, e => e.Id != id).FirstOrDefault();
            if (userList != null)
            {
                if (userList.Name.ToLower() == roleName.ToLower())
                {
                    return 1;
                }
                else if (userList.DisplayName.ToLower() == displayRoleName.ToLower())
                {
                    return 2;
                }
            }
            return 0;
        }

        public override async Task DeleteAsync(EntityDto<int> input)
        {
            CheckDeletePermission();

            var role = await _roleManager.FindByIdAsync(input.Id.ToString());
            var users = await _userManager.GetUsersInRoleAsync(role.NormalizedName);

            foreach (var user in users)
            {
                CheckErrors(await _userManager.RemoveFromRoleAsync(user, role.NormalizedName));
            }

            CheckErrors(await _roleManager.DeleteAsync(role));
        }

        public Task<List<FlatTreeSelectDto<string>>> GetAllPermissions()
        {
            var permissions = PermissionManager.GetAllPermissions();
            var tree = ObjectMapper.Map<List<FlatPermissionDto>>(permissions).OrderBy(p => p.DisplayName).ToList();
            var resutl = tree.Select(e => new FlatTreeSelectDto<string> { Id = e.Name, ParentId = e.ParentName, DisplayName = e.DisplayName }).ToList();
            return Task.FromResult(resutl);
        }

        protected override IQueryable<Role> CreateFilteredQuery(PagedRoleResultRequestDto input)
        {
            return Repository.GetAllIncluding(x => x.Permissions)
                .WhereIf(!input.Keyword.IsNullOrWhiteSpace(), x => x.Name.Contains(input.Keyword)
                || x.DisplayName.Contains(input.Keyword)
                || x.Description.Contains(input.Keyword));
        }

        protected override async Task<Role> GetEntityByIdAsync(int id)
        {
            return await Repository.GetAllIncluding(x => x.Permissions).FirstOrDefaultAsync(x => x.Id == id);
        }

        protected override IQueryable<Role> ApplySorting(IQueryable<Role> query, PagedRoleResultRequestDto input)
        {
            return query.OrderBy(input.Sorting ?? "creationTime DESC");
        }

        protected virtual void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }

        public async Task<GetRoleForEditOutput> GetRoleForEdit(EntityDto input)
        {
            var permissions = PermissionManager.GetAllPermissions();
            var role = await _roleManager.GetRoleByIdAsync(input.Id);
            var grantedPermissions = (await _roleManager.GetGrantedPermissionsAsync(role)).ToArray();
            var roleEditDto = ObjectMapper.Map<RoleEditDto>(role);
            var tree = ObjectMapper.Map<List<FlatPermissionDto>>(permissions).OrderBy(p => p.DisplayName).ToList();
            var resutl = tree.Select(e => new FlatTreeSelectDto<string> { Id = e.Name, ParentId = e.ParentName, DisplayName = e.DisplayName }).ToList();
            return new GetRoleForEditOutput
            {
                Role = roleEditDto,
                Permissions = resutl,
                GrantedPermissionNames = grantedPermissions.Select(p => p.Name).ToList()
            };
        }
    }
}

