import { Component, Injector, ChangeDetectionStrategy } from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { MessageService } from "primeng/api";
import { SelectItem } from "primeng/api";

@Component({
  templateUrl: "./home.component.html",
  animations: [appModuleAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent extends AppComponentBase {
  dropdown: SelectItem[];
  data: any;
  constructor(private messageService: MessageService, injector: Injector) {
    super(injector);
    this.data = {
      labels: ["Pham", "Manh", "Hung", "Dep", "Trai", "Nhat", "ok"],
      datasets: [
        {
          label: "First Dataset",
          data: [65, 59, 80, 81, 56, 55, 90],
          fill: false,
          borderColor: "#4bc0c0",
        },
        {
          label: "Second Dataset",
          data: [28, 48, 40, 19, 86, 27, 20],
          fill: false,
          borderColor: "#565656",
        },
      ],
    };
    this.dropdown = [
      { label: "Select City", value: null },
      { label: "New York", value: { id: 1, name: "Phạm", code: "NY" } },
      { label: "Rome", value: { id: 2, name: "Mạnh ", code: "RM" } },
      { label: "London", value: { id: 3, name: "Hùng", code: "LDN" } },
      { label: "Istanbul", value: { id: 4, name: "Đẹp ", code: "IST" } },
      { label: "Paris", value: { id: 5, name: "Trai", code: "PRS" } },
    ];
  }

  selectData(event) {
    this.messageService.add({
      severity: "info",
      summary: "Data Selected",
      detail:
        this.data.datasets[event.element._datasetIndex].data[
          event.element._index
        ],
    });
  }
}
