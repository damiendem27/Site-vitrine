// Gestion de l'organigramme et des fiches employés
const employees = {
    pdi: {
        name: 'Damien Demange',
        role: 'PDG (Président-Directeur Général)',
        pdf: '../documents/ressources/Fiche de poste/DEMANGE DAMIEN SIO1 - Fiches de poste.pdf'
    },
    fp: {
        name: 'François Pichot',
        role: 'Responsable Magasin',
        pdf: '../documents/ressources/Fiche de poste/François Pichot.pdf.pdf'
    },
    jed: {
        name: 'Jean-Eude Durant',
        role: 'Responsable Service Commercial',
        pdf: '../documents/ressources/Fiche de poste/Jean Eude Durant.pdf.pdf'
    },
    bd: {
        name: 'Baptiste Dias',
        role: 'Chargé de Marketing',
        pdf: '../documents/ressources/Fiche de poste/Baptiste Dias.pdf.pdf'
    },
    mag: {
        name: 'Sebastien Reichmann',
        role: 'Magasinier',
        pdf: '../documents/ressources/Fiche de poste/Sebastien Reichmann.pdf (1).pdf'
    },
    vend: {
        name: 'Paul Bison',
        role: 'Vendeur',
        pdf: '../documents/ressources/Fiche de poste/Paul Bison.pdf.pdf'
    }
};

const modal = document.getElementById('employeeModal');
const modalClose = document.getElementById('modalClose');
const empName = document.getElementById('empName');
const empRole = document.getElementById('empRole');
const empPdf = document.getElementById('empPdf');
const empPdfLink = document.getElementById('empPdfLink');

function openEmployeeModal(empId) {
    const emp = employees[empId];
    if (emp) {
        empName.textContent = emp.name || '';
        empRole.textContent = emp.role || '';
        if(emp.pdf){
            const encoded = encodeURI(emp.pdf);
            empPdf.src = encoded;
            empPdfLink.href = encoded;
        } else {
            empPdf.src = '';
            empPdfLink.href = '#';
        }
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
    }
}

function closeModal() {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
}

document.querySelectorAll('.employee').forEach(box => {
    box.addEventListener('click', function() {
        const empId = this.getAttribute('data-employee');
        openEmployeeModal(empId);
    });
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if(e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeModal(); });
