
import React, { useState, useContext, useEffect } from 'react';
import {
  DataGrid,
  GridEditRowsModel,
} from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';
import StateContext from '../../context/context';
import { makeStyles } from '@material-ui/core/styles';

import { StatePropsPanelProps } from '../../interfaces/Interfaces';

const getColumns = (props, state, dispatch) => {
  return [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      editable: false,
    },
    {
      field: 'key',
      headerName: 'Key',
      width: 90,
      editable: true,
    },
    {
      field: 'value',
      headerName: 'Value',
      width: 90,
      editable: true,
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 90,
      editable: false,
    },
    {
      field: 'delete',
      headerName: 'X',
      width: 70,
      editable: false,
      renderCell: function renderCell(params:any) {
        const getIdRow = () => {
          const { api } = params;
          // const fields = api.getAllColumns().map((c: any) => c.field).filter((c : any) => c !== '__check__' && !!c);
          return params.id;
          // return params.getValue(fields[0]);
        };
        return ( 
          <Button style={{width:`${3}px`}}
          onClick={() => {
            const deleteAttributeWithState = (id) => {
              console.log('id=',id);
              console.log('state.components =', state.components)
              let currentComponent; 
              if(!props.providerId) {
                const currentId = state.canvasFocus.componentId;
                currentComponent = state.components[currentId - 1];
                console.log('currentId', currentId);
                console.log('currentComponent =', currentComponent);
              }
              else {
                currentComponent = state.components[props.providerId - 1]; 
              }
              const filtered = currentComponent.stateProps.filter(element => element.id !== id);
              console.log('flitered=', filtered);     
              dispatch({
                type: 'DELETE STATE', 
                payload: {stateProps: filtered}
              });
            }
        
            deleteAttributeWithState(getIdRow()); 
          }

          }>
            <ClearIcon style={{width:`${15}px`}}/>
          </Button>
        );
      },
    },
  ];
};

//, providerId=1
const TableStateProps = (props) => {
  const classes = useStyles();
  const [state, dispatch] = useContext(StateContext);
  const [editRowsModel] = useState <GridEditRowsModel> ({});
  const [gridColumns, setGridColumns] = useState([]);
  

  useEffect(() => {
    setGridColumns(getColumns(props, state, dispatch));
  }, [props.isThemeLight])
  // get currentComponent by using currently focused component's id
  const currentId = state.canvasFocus.componentId;
  const currentComponent = state.components[currentId - 1];
  
  // rows to show are either from current component or from a given provider
  let rows = [];
  if (!props.providerId) {
    rows = currentComponent.stateProps.slice();
  } else {
    const providerComponent = state.components[props.providerId - 1];
    rows = providerComponent.stateProps.slice();
  }

  const { selectHandler } : StatePropsPanelProps = props;
  
  // when component gets mounted, sets the gridColumn
  useEffect(() => {
    setGridColumns(getColumns(props, state, dispatch));
  }, [state]);
  
  return (
    <div className={'state-prop-grid'}>
      <DataGrid
        rows={rows}
        columns={gridColumns}
        pageSize={5}
        editRowsModel={editRowsModel}
        onRowClick = {selectHandler}
        className={props.isThemeLight ? classes.themeLight : classes.themeDark}
      />
    </div>
  );
};


const useStyles = makeStyles({
  themeLight: {
    color: 'rgba(0,0,0,0.54)',
    '& .MuiTablePagination-root': {
      color: 'rbga(0,0,0,0.54)'
    },
  },
  themeDark: {
    color: 'white',
    '& .MuiTablePagination-root': {
      color: 'white'
    },
    '& .MuiIconButton-root': {
      color: 'white'
    },
    '& .MuiSvgIcon-root': {
      color: 'white'
    },
    '& .MuiDataGrid-window': {
      backgroundColor: 'rgba(0,0,0,0.54)'
    }
  }
});

export default TableStateProps;
