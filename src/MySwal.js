import Swal from 'sweetalert2';

const MySwal = Swal.mixin({
  background: '#0f0f1a',
  color: '#ffffff',
  confirmButtonColor: '#c8ff00',
  cancelButtonColor: '#1c1c33',
  customClass: {
    popup:         'swal-popup',
    title:         'swal-title',
    htmlContainer: 'swal-text',
    confirmButton: 'swal-confirm',
    cancelButton:  'swal-cancel',
  }
});

export default MySwal;