import React, { useState } from 'react';
import { useTable, Column, useFilters, useSortBy, usePagination } from 'react-table';
import { Tabs } from '../Pools/ShortCardHeader';

export interface ISimmerEffectProps {
  lines:number;
}

export function SimmerEffect (props: ISimmerEffectProps) {
  return (
    <>
      {Array(props.lines).fill(1).map((_,i)=><tr key={`simmerEffect_${i}`} className={`border border-borderCommon h-16 bg-cardBackGround flex px-5 py-3 items-center justify-between rounded-lg animate-pulse `}>
    </tr>)}
    </>
  );
}
const Table = <D extends object>({ columns, data,shortby }: { columns: Column<D>[]; data: D[],shortby?:string }) => {
  const [shortByGroup,setshortByGroup]=useState({
    id: shortby??'usd',
    desc: true,
  })
  const {
    getTableProps,
    headerGroups,
    page,
    prepareRow,
    gotoPage,
    pageCount,
    setPageSize,
    state: { pageIndex },
    setSortBy,
  } = useTable<D>(
    // ? cannot solve this type error for columns 😪
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: 10,
        sortBy: [
          shortByGroup,
        ],
      },
      autoResetPage: false,
      autoResetExpanded: false,
      autoResetGroupBy: false,
      autoResetSelectedRows: false,
      autoResetSortBy: false,
      autoResetFilters: false,
      autoResetRowState: false,
    },
    useFilters,
    useSortBy,
    usePagination,
  );
  const shortByHandler=(sortByAtt: any)=>{
    const currentShortBy=Object.assign({},shortByGroup);
    if(currentShortBy.id == sortByAtt){
      currentShortBy.desc=!currentShortBy.desc;
      setshortByGroup(currentShortBy);
      setSortBy([currentShortBy]);

    }else{
       setshortByGroup({
        id: sortByAtt,
        desc: true,
      });
      setSortBy([{
        id: sortByAtt,
        desc: true,
      }])
    }
  }
  if(true){
    return(
      <div>
      <table className='w-full flex flex-col gap-3'>
      <thead>
        
      {headerGroups.map((headerGroup) => (
      <tr className='border border-borderCommon bg-cardBackGround flex px-5 py-3 items-center rounded-t-xl	rounded-b'>       
        {headerGroup.headers.map((column,i) => (      
           <Tabs 
           text={column.render('Header')?.toString()}
           className='justify-start'
           isFirstRow={i==0}
           isToolTipEnabled={column.hasOwnProperty('isToolTipEnabled')}
           onClick={column.hasOwnProperty('canShort')?()=>{shortByHandler(column.id)}:()=>{}}
           arrowUp={shortByGroup.id==column.id?shortByGroup.desc?"down":"up":undefined}
           subText={column.hasOwnProperty('subText')?column.render('subText')?.toString():''}
           />
           ))}
      </tr>
      ))}
      
      </thead>
      <tbody className=' flex-col flex gap-2'>
      {data.length===0 ?<SimmerEffect lines={2}/>:null }  
      {data.length ? page.map((row:any) => {
              prepareRow(row);
              return (
             // eslint-disable-next-line react/jsx-key
             <tr 
             className={`border border-borderCommon  bg-cardBackGround flex px-5 py-3 items-center justify-between rounded-lg slideFromTop`}>
     
                
             {row.cells.map((cell:any,i:any) => {
                    return (
                      // eslint-disable-next-line react/jsx-key
                      <td className={`flex-1  flex items-center ${i==0?'justify-start':'justify-end'}`}>
                         {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>);           
            }):null}
      </tbody>
      </table>
      
      </div>

    );
}



  return (
    <>
    <div>
      <div className='tableouverdir'>
        <MuiTable {...getTableProps()} className='bridgenewtable'>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              // eslint-disable-next-line react/jsx-key
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  // eslint-disable-next-line react/jsx-key
                  <TableCell {...column.getHeaderProps()} sx={{
                    borderColor:'rgba(255, 255, 255, 0.15)',
                    display:{xs:column.hasOwnProperty('xsShow')?'table-cell':'none',sm:'table-cell'}}}>
                    <div className="flex flex-row align-items-center" >
                      <span className="mx-1" style={{display:'flex'}} 
                      onClick={()=>{!column.hasOwnProperty('canNotSearch')?shortByHandler(column.id):null}}
                      >{column.render('Header')}
                      {shortByGroup.id==column.id?shortByGroup.desc?<KeyboardArrowDownIcon/>:<KeyboardArrowUpIcon/>:<KeyboardArrowUpIcon sx={{opacity:0}}/>}
                      
                      </span>
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody sx={{ fontSize: '1.15rem' }}>
            {!data.length ? simmerLoaderScreen(10):null}
            {data.length ? page.map((row) => {
              prepareRow(row);
              return (
                // eslint-disable-next-line react/jsx-key
                <TableRow {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      // eslint-disable-next-line react/jsx-key
                      <TableCell {...cell.getCellProps()} sx={{borderColor:'rgba(255, 255, 255, 0.15)',display:{xs:cell.column.hasOwnProperty('xsShow')?'table-cell':'none',sm:'table-cell'}}}>
                        <span className="mx-1" style={{width:'100px'}}>{cell.render('Cell')}</span>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            }):null}
          </TableBody>
        </MuiTable>
        </div>
        <Box className='paginationcontainer'>
          <TablePagination
            count={pageCount}
            rowsPerPage={10}
            page={pageIndex}
            setPageSize={setPageSize}
            onChangePage={(number) => gotoPage(number)}
          />
        </Box>
      </div>
    </>
  );
};

export default Table;
 