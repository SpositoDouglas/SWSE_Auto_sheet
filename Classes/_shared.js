'use strict';

// Helper para reaproveitar árvores de talentos de outras classes (base ou de
// prestígio) dentro de uma classe de prestígio. Várias classes de prestígio
// permitem escolher talentos de árvores de classes base, além das suas próprias.
//
// Deve ser carregado ANTES dos arquivos de classes de prestígio (e depois das
// classes base, cujas árvores ele referencia).
//
// Uso: ...classTrees(CLASS_SOLDIER, 'armorSpecialist', 'commando')
function classTrees(classObj, ...keys) {
  if (!classObj || !Array.isArray(classObj.talentTrees)) return [];
  return classObj.talentTrees.filter(t => keys.includes(t.key));
}
