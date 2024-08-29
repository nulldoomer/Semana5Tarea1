import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { IFactura } from '../Interfaces/factura';
import { Router, RouterLink } from '@angular/router';
import { FacturaService } from '../Services/factura.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-facturas',
  standalone: true,
  imports: [SharedModule, RouterLink],
  templateUrl: './facturas.component.html',
  styleUrl: './facturas.component.scss'
})
export class FacturasComponent implements OnInit {
  listafacturas: IFactura[] = [];
  constructor(private facturaServicio: FacturaService) {}
  ngOnInit(): void {
    this.listarFacturas();
  }
  listarFacturas(){
    this.facturaServicio.todos().subscribe((data: IFactura[]) => {
      this.listafacturas = data;
    });
  }

  eliminar(idFactura) {
    Swal.fire({

      title : "Facturas",
      text: "Esta seguro de eliminar esta factura?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonAriaLabel: "#d33",
      cancelButtonAriaLabel: "#3085d6",
      confirmButtonText: "Eliminar Factura"

    }).then((result) =>{

      if(result.isConfirmed){
        this.facturaServicio.eliminar(idFactura).subscribe((data) =>{
          Swal.fire("Facturas", "La factura ha sido eliminada.", "success");
          this.listarFacturas();

        });
      }
    });
  }


}
