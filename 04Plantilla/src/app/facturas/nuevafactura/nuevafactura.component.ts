import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, Event, ActivatedRoute } from '@angular/router';
import { IFactura } from 'src/app/Interfaces/factura';
import { ICliente } from 'src/app/Interfaces/icliente';
import { ClientesService } from 'src/app/Services/clientes.service';
import { FacturaService } from 'src/app/Services/factura.service';

@Component({
  selector: 'app-nuevafactura',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './nuevafactura.component.html',
  styleUrl: './nuevafactura.component.scss'
})
export class NuevafacturaComponent implements OnInit {
  //variables o constantes
  titulo = 'Nueva Factura';
  listaClientes: ICliente[] = [];
  listaClientesFiltrada: ICliente[] = [];
  totalapagar: number = 0;
  idFactura : number = 0;
  //formgroup
  frm_factura: FormGroup;

  ///////
  constructor(
    private clietesServicios: ClientesService,
    private facturaService: FacturaService,
    private navegacion: Router,
    private ruta: ActivatedRoute

  ) {}

  ngOnInit(): void {
    
    this.idFactura = parseInt(this.ruta.snapshot.paramMap.get('id'));

    this.frm_factura = new FormGroup({
      Fecha: new FormControl('', Validators.required),
      Sub_total: new FormControl('', Validators.required),
      Sub_total_iva: new FormControl('', Validators.required),
      Valor_IVA: new FormControl('0.15', Validators.required),
      Clientes_idClientes: new FormControl('', Validators.required)
    });
    this.cargarListaClientes();
    
    if(this.idFactura > 0){
      this.facturaService.uno(this.idFactura).subscribe((unafactura) =>{
        this.frm_factura.controls["Fecha"].setValue(unafactura.Fecha.split(" ")[0]);
        
        console.log(unafactura.Fecha);
        
        this.frm_factura.controls["Sub_total"].setValue(unafactura.Sub_total);
        this.frm_factura.controls["Sub_total_iva"].setValue(unafactura.Sub_total_iva);
        this.frm_factura.controls["Valor_IVA"].setValue(unafactura.Valor_IVA);

        console.log(unafactura.Valor_IVA);

        this.frm_factura.controls["Clientes_idClientes"].setValue(unafactura.Clientes_idClientes);
        console.log(unafactura.Clientes_idClientes);
        console.log(unafactura);
        this.titulo = "Editar Factura";
        
        this.calculos();
      });
    }
    

  }
  cargarListaClientes(){
    this.clietesServicios.todos().subscribe({
      next: (data) => {
        this.listaClientes = data;
        this.listaClientesFiltrada = data;
      },
      error: (e) => {
        console.log(e);
      }
    });
  }

  grabar() {
    let factura : IFactura;
    if(this.idFactura >0){
      factura = {
        idFactura: this.idFactura,
        Fecha: this.frm_factura.get('Fecha')?.value,
        Sub_total: this.frm_factura.get('Sub_total')?.value,
        Sub_total_iva: this.frm_factura.get('Sub_total_iva')?.value,
        Valor_IVA: this.frm_factura.get('Valor_IVA')?.value,
        Clientes_idClientes: this.frm_factura.get('Clientes_idClientes')?.value
      };
      this.facturaService.actualizar(factura).subscribe((respuesta) => {
        if (parseInt(respuesta) > 0) {
          alert('Factura actualizada');
          this.navegacion.navigate(['/facturas']);
        }
      });
     
    }else{

      factura = {
       Fecha: this.frm_factura.get('Fecha')?.value,
       Sub_total: this.frm_factura.get('Sub_total')?.value,
       Sub_total_iva: this.frm_factura.get('Sub_total_iva')?.value,
       Valor_IVA: this.frm_factura.get('Valor_IVA')?.value,
       Clientes_idClientes: this.frm_factura.get('Clientes_idClientes')?.value
     };

     this.facturaService.insertar(factura).subscribe((respuesta) => {
       if (parseInt(respuesta) > 0) {
         alert('Factura grabada');
         this.navegacion.navigate(['/facturas']);
       }
     });
    }

  }
  calculos() {
    let sub_total = this.frm_factura.get('Sub_total')?.value;
    let iva = this.frm_factura.get('Valor_IVA')?.value;
    let sub_total_iva = sub_total * iva;
    this.frm_factura.get('Sub_total_iva')?.setValue(sub_total_iva);
    this.totalapagar = parseInt(sub_total) + sub_total_iva;
  }

  cambio(objetoSleect: any) {
    let idCliente = objetoSleect.target.value;
    this.frm_factura.get('Clientes_idClientes')?.setValue(idCliente);
  }
}
