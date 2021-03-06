// tslint:disable
import { Component, Injector, OnInit } from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";
import {
  Router,
  RouterEvent,
  NavigationEnd,
  PRIMARY_OUTLET,
} from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { filter } from "rxjs/operators";
import { MenuItem } from "@shared/layout/menu-item";
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from "@angular/cdk/layout";
import { MegaMenuItem } from "primeng/api";

@Component({
  selector: "sidebar-menu",
  templateUrl: "./sidebar-menu.component.html",
})
export class SidebarMenuComponent extends AppComponentBase implements OnInit {
  menuItems: MenuItem[];
  menuItemsMap: { [key: number]: MenuItem } = {};
  activatedMenuItems: MenuItem[] = [];
  routerEvents: BehaviorSubject<RouterEvent> = new BehaviorSubject(undefined);
  homeRoute = "/app/home";
  testmenu = false;
  items: MegaMenuItem[];

  constructor(
    injector: Injector,
    private router: Router,
    public breakpointObserver: BreakpointObserver
  ) {
    super(injector);
    this.router.events.subscribe(this.routerEvents);
  }

  ngOnInit(): void {
    this.items = [
      {
        label: "Demo",
        routerLink: "/app/main/danh-muc/demo",
      },
      {
        label: "Quản lý Hệ thống",
        icon: "fas fa-users",
        items: [
          [
            {
              label: "Quản lý Hệ thống",
              items: [
                {
                  label: "Quản lý Người dùng",
                  routerLink: "/app/users",
                  visible: this.isGranted("Pages.Users"),
                },
                {
                  label: "Quản lý Phân quyền",
                  routerLink: "/app/roles",
                  visible: this.isGranted("Pages.Roles"),
                },
                {
                  label: "Lịch sử Người dùng",
                  routerLink: "/app/auditLogs",
                  visible: this.isGranted("Pages.QuanLyLichSuNguoiDung"),
                },
              ],
            },
          ],
        ],
        visible: this.isGrantedAny(
          "Pages.Users",
          "Pages.Roles",
          "Pages.QuanLyLichSuNguoiDung"
        ),
      },
      {
        label: "Test" ,
        routerLink : '/app/main/test' ,
        icon: "fas fa-vial",
      },
      {
        label: "Test2" ,
        routerLink : '/app/main/test2' ,
        icon: "fas fa-vial",
      }

    ];

    this.menuItems = this.getMenuItems();
    this.patchMenuItems(this.menuItems);
    this.routerEvents
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const currentUrl = event.url !== "/" ? event.url : this.homeRoute;
        const primaryUrlSegmentGroup =
          this.router.parseUrl(currentUrl).root.children[PRIMARY_OUTLET];
        if (primaryUrlSegmentGroup) {
          this.activateMenuItems("/" + primaryUrlSegmentGroup.toString());
        }
      });

    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .subscribe((state: BreakpointState) => {
        if (
          state.breakpoints[Breakpoints.XSmall] ||
          state.breakpoints[Breakpoints.Small]
        ) {
          this.testmenu = false;
        } else if (
          state.breakpoints[Breakpoints.Medium] ||
          state.breakpoints[Breakpoints.Large] ||
          state.breakpoints[Breakpoints.XLarge]
        ) {
          this.testmenu = true;
        }
      });
  }

  getMenuItems(): MenuItem[] {
    return [
      new MenuItem("Demo", "/app/main/danh-muc/demo", "fa-thin fa-angle-left"),

      new MenuItem(
        "Quản lý Hệ thống","","fas fa-users",
        this.getPermission(
          "Pages.Users",
          "Pages.Roles",
          "Pages.QuanLyLichSuNguoiDung",
          "Pages.QuanLyMailServer"
        ),
        [
          new MenuItem("Quản lý Người dùng", "/app/users", "", "Pages.Users"),
          new MenuItem("Quản lý Phân quyền", "/app/roles", "", "Pages.Roles"),
          new MenuItem(
            "Lịch sử Người dùng",
            "/app/auditLogs",
            "",
            "Pages.QuanLyLichSuNguoiDung"
          ),
          new MenuItem(
            "Quản lý Mail Server",
            "/app/main/cau-hinh-mail-server",
            "",
            "Pages.QuanLyMailServer"
          ),
        ]
      ),
      new MenuItem("Test","/app/main/danh-muc/tests", "" ,
        this.getPermission (
          "Pages.Test"
        )
      ),
      new MenuItem("Test2","/app/main/danh-muc/demo/Test2/test2", "" ,
        this.getPermission (
          "Pages.Test2"
        )
      ),
    ];
  }

  getPermission(...permissions: string[]) {
    let checkPermission = false;
    permissions.forEach((element) => {
      if (this.isGrantedAny(element)) {
        checkPermission = true;
      }
    });
    return checkPermission ? "" : "abc";
  }

  patchMenuItems(items: MenuItem[], parentId?: number): void {
    items.forEach((item: MenuItem, index: number) => {
      item.id = parentId ? Number(parentId + "" + (index + 1)) : index + 1;
      if (parentId) {
        item.parentId = parentId;
      }
      if (parentId || item.children) {
        this.menuItemsMap[item.id] = item;
      }
      if (item.children) {
        this.patchMenuItems(item.children, item.id);
      }
    });
  }

  activateMenuItems(url: string): void {
    this.deactivateMenuItems(this.menuItems);
    this.activatedMenuItems = [];
    const foundedItems = this.findMenuItemsByUrl(url, this.menuItems);
    foundedItems.forEach((item) => {
      this.activateMenuItem(item);
    });
  }

  deactivateMenuItems(items: MenuItem[]): void {
    items.forEach((item: MenuItem) => {
      item.isActive = false;
      item.isCollapsed = true;
      if (item.children) {
        this.deactivateMenuItems(item.children);
      }
    });
  }

  findMenuItemsByUrl(
    url: string,
    items: MenuItem[],
    foundedItems: MenuItem[] = []
  ): MenuItem[] {
    items.forEach((item: MenuItem) => {
      if (item.route === url) {
        foundedItems.push(item);
      } else if (item.children) {
        this.findMenuItemsByUrl(url, item.children, foundedItems);
      }
    });
    return foundedItems;
  }

  activateMenuItem(item: MenuItem): void {
    item.isActive = true;
    if (item.children) {
      item.isCollapsed = false;
    }
    this.activatedMenuItems.push(item);
    if (item.parentId) {
      this.activateMenuItem(this.menuItemsMap[item.parentId]);
    }
  }

  isMenuItemVisible(item: MenuItem): boolean {
    if (!item.permissionName) {
      return true;
    }
    return this.permission.isGranted(item.permissionName);
  }
}
