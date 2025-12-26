
// // ==================== COMPONENT 4: DATA MAPPING TABLE ====================


// export const DataMappingTable = ({ source, entity, onMap, existingMappings }) => {
//     const [selectedTable, setSelectedTable] = useState(source.tables[0]);

//     return (
//         <Box>
//             <Typography variant="body2" sx={{ mb: 2 }}>Table: {selectedTable.name}</Typography>

//             <TableContainer>
//                 <Table size="small">
//                     <TableHead>
//                         <TableRow>
//                             <TableCell>Column Name</TableCell>
//                             <TableCell>Type</TableCell>
//                             <TableCell>Map to Field</TableCell>
//                             <TableCell>Status</TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {selectedTable.columns.map(column => {
//                             const existingMapping = existingMappings.find(m =>
//                                 m.source === `${selectedTable.name}.${column.name}`
//                             );

//                             return (
//                                 <TableRow key={column.name}>
//                                     <TableCell>{column.name}</TableCell>
//                                     <TableCell>{column.type}</TableCell>
//                                     <TableCell>
//                                         <Select
//                                             size="small"
//                                             fullWidth
//                                             value={existingMapping?.semanticField || ''}
//                                             onChange={(e) => {
//                                                 if (e.target.value) {
//                                                     onMap(
//                                                         `${selectedTable.name}.${column.name}`,
//                                                         entity.id,
//                                                         e.target.value
//                                                     );
//                                                 }
//                                             }}
//                                         >
//                                             <MenuItem value="">Select field...</MenuItem>
//                                             {entity.fields.map(field => (
//                                                 <MenuItem key={field.id} value={field.id}>
//                                                     {field.name} ({field.type})
//                                                 </MenuItem>
//                                             ))}
//                                         </Select>
//                                     </TableCell>
//                                     <TableCell>
//                                         {existingMapping ? (
//                                             <Chip label="Mapped" size="small" color="success" />
//                                         ) : (
//                                             <Chip label="Unmapped" size="small" variant="outlined" />
//                                         )}
//                                     </TableCell>
//                                 </TableRow>
//                             );
//                         })}
//                     </TableBody>
//                 </Table>
//             </TableContainer>
//         </Box>
//     );
// };

// export default DataMappingTable;