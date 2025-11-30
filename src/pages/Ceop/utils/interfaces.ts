export interface DataEquipamentIdentification {
  id: string;
}

export interface DataEquipament {
  title: string;
  idEquipament: string;
  allocation_id: string | null;
  equipmentTypeID: string;
}

export interface DataColaborator {
  title: string;
  id: string;
  username: string;
  allocations: any[];
}

export interface UploadResponse {
  uploadedFileUrl: string;
  fileName: string;
}

// Base Details for Allocated and Devolution

export interface BaseDetails {
  id: string;
  id_colaborador_ceop: string;
  nome_colaborador_ceop: string;
  ref_colaborador: string;
  equipment_type: string;
  device_number: string;
  id_pegador: string;
  nome_pegador: string;
  allocated_at: string;
}

export interface AllocatedDetails extends BaseDetails {
  allocated_details: string;
  allocated_image: string;
}

export interface DevolutionDetails {
  returned_at: string;
  returned_details: string;
  allocation_id: string;
  equipmentId: string;
  id_devolvedor: string;
  nome_devolvedor: string;
  returned_image: string;
  id_devolvedor_ceop: number;
  nome_devolvedor_ceop: string;
}
