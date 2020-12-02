import {DeleteOutlined, DownOutlined, EditOutlined, PlusOutlined, ExportOutlined} from '@ant-design/icons';
import {notification, Button, Col, Descriptions, Divider, Dropdown, Form, Input, Menu, message, Popconfirm, Popover, Row, Select, Tag, Transfer,Switch} from 'antd';
import React, {useEffect,useRef, useState} from 'react';
import KeyOutlined from '@ant-design/icons/lib/icons/KeyOutlined';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import ProTable from 'mtianyan-pro-table';
import CreateForm from './components/CreateForm';
import {addDemoDefaultModel, queryDemoDefaultModel, removeDemoDefaultModel, updateDemoDefaultModel,queryDemoDefaultModelVerboseName, queryDemoDefaultModelListDisplay, queryDemoDefaultModelDisplayOrder} from './service';
import UpdateForm from './components/UpdateForm';
import UploadAvatar from '@/components/UploadAvatar';


import moment from 'moment';
const {Option} = Select;
import { BooleanFormItem, dealManyToManyFieldTags, fileUpload,twoColumns, richForm, richCol, dealPureSelectField, orderForm, exportExcelCurrent, exportExcelAll, getUpdateColumns, dealRemoveError, dealError, BooleanDisplay, dealDateTimeDisplay, dealManyToManyField, dealTime, deepCopy, fieldErrorHandle, getTableColumns, renderManyToMany, richTrans,dealForeignKeyField, renderForeignKey, fieldsLevelErrorHandle} from '@/utils/utils';
import 'braft-editor/dist/index.css'
const FormItem = Form.Item;
const TableList = () => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  
  const [updateFormValues, setUpdateFormValues] = useState({});
  const actionRef = useRef();
  const addFormRef = useRef();
  const updateFormRef = useRef();

  const handleAdd = async fields => {
  const hide = message.loading('正在添加');

  try {
    await addDemoDefaultModel({...fields});
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
            return dealError(error, addFormRef, hide, "添加");
  }
};

  const handleUpdate = async (value, current_id) => {
  const hide = message.loading('正在修改');

  try {
    await updateDemoDefaultModel(value, current_id);
    hide();
    message.success('修改成功');
    return true;
  } catch (error) {
      return dealError(error, updateFormRef, hide, "修改");
  }
};

  const handleRemove = async selectedRows => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {
    const ids = selectedRows.map(row => row.id).join(',');
    await removeDemoDefaultModel(ids);
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
      hide()
      return dealRemoveError(error, "删除");
  }
};
  
  const dateFieldList = ["date_field","date_time_field"]
  const base_columns = [{
                             title: 'id',
                             
        hideInForm: true,
        hideInSearch: true,
        
                             
                             dataIndex: 'id',
                             valueType: 'digit',
                             rules: [
                                     
                             ],
                             
                             
                        },
                      {
                             title: 'Char默认值',
                             
                             initialValue: "tyadmin",
                             dataIndex: 'default_char_field',
                             
                             rules: [
                                     
                             ],
                             
                             
                        },
                      {
                             title: 'Integer默认值',
                             
                             initialValue: 2020,
                             dataIndex: 'default_number_field',
                             valueType: 'digit',
                             rules: [
                                     
                             ],
                             
                             
                        },
                      {
                             title: 'Float默认值',
                             
                             initialValue: "0.1",
                             dataIndex: 'default_float_number_field',
                             
                             rules: [
                                     
                             ],
                             
                             
                        },
                      {
                             title: 'Boolean默认值',
                             
                             initialValue: true,
                             dataIndex: 'default_bool_field',
                             
                             rules: [
                                     
                             ],
                             
                                     render: (text, record) => {
                                  return BooleanDisplay(text);
                                },
                        renderFormItem: (item, {value, onChange}) => {
                          return BooleanFormItem(value, onChange);
                        },
        
                             
                        },
                      {
                             title: 'Text默认值',
                             
                             initialValue: "一大段文字",
                             dataIndex: 'default_text_field',
                             valueType: 'textarea',
                             rules: [
                                     
                             ],
                             
                             
                        },
                      {
                             title: 'Date默认值',
                             
                             
                             dataIndex: 'date_field',
                             valueType: 'date',
                             rules: [
                                     
                             ],
                             
                             
                        },
                      {
                             title: 'DateTime默认值',
                             
            hideInForm: true,
            
                             
                             dataIndex: 'date_time_field',
                             valueType: 'dateTime',
                             rules: [
                                     
                             ],
                             
                             
                        },
                          {
                              title: '操作',
                              dataIndex: 'option',
                              valueType: 'option',
                                    fixed: 'right',
          width: 100,
                              render: (text, record) => (
                                <>

                                  <EditOutlined title="编辑" className="icon" onClick={async () => {
                                    record.date_field = record.date_field === null ? record.date_field : moment(record.date_field);record.date_time_field = record.date_time_field === null ? record.date_time_field : moment(record.date_time_field);
                                    handleUpdateModalVisible(true);
                                    setUpdateFormValues(record);
                                  }} />
                                  <Divider type="vertical" />
                                  <Popconfirm
                                    title="您确定要删除全部字段类型-提供默认值吗？"
                                    placement="topRight"
                                    onConfirm={() => {
                                      handleRemove([record])
                                      actionRef.current.reloadAndRest();
                                    }}
                                    okText="确定"
                                    cancelText="取消"
                                  >
                                    <DeleteOutlined title="删除" className="icon" />
                                  </Popconfirm>
                                </>
                              ),
                            },];

  let cp = deepCopy(base_columns);

  const [formOrder, setFormOrder] = useState([]);

  useEffect(()=>{
    queryDemoDefaultModelDisplayOrder().then(r => {
      setFormOrder(r.form_order)
    })
  }, [])
  const table_columns = getTableColumns(cp);

  let order_cp = deepCopy(base_columns);
  const form_ordered = orderForm(formOrder, order_cp);

  const create_columns = [...form_ordered];
  const update_cp = deepCopy(form_ordered)
  const update_columns = getUpdateColumns(update_cp);

  const [columnsStateMap, setColumnsStateMap] = useState({});

  const [paramState, setParamState] = useState({});

  useEffect(()=>{
    queryDemoDefaultModelListDisplay().then(value => {
      setColumnsStateMap(value)
    })
  },[])


  


    
  return (
    <PageHeaderWrapper>
      <ProTable
           beforeSearchSubmit={(params => {
                         dealTime(params, dateFieldList);
          return params;
        })}
        params={paramState}
           scroll={{x: 'max-content'}}
        columnsStateMap={columnsStateMap}
        onColumnsStateChange={(map) => setColumnsStateMap(map)}
        headerTitle="全部字段类型-提供默认值表格"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={(action, {selectedRows}) => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
            <Button type="primary" onClick={() => exportExcelAll(paramState, queryDemoDefaultModel, table_columns, '全部字段类型-提供默认值-All')}>
            <ExportOutlined /> 导出全部
          </Button>,
          <Input.Search style={{marginRight: 20}} placeholder="搜索全部字段类型-提供默认值 " onSearch={value => {
            setParamState({
              search: value,
            });
            actionRef.current.reload();
          }} />,
          selectedRows && selectedRows.length > 0 && (
            <Dropdown
              overlay={
                <Menu
                  onClick={async e => {
                    if (e.key === 'remove') {
                      await handleRemove(selectedRows);
                      actionRef.current.reloadAndRest();
                    }
                                        else if(e.key === 'export_current'){
                      exportExcelCurrent(selectedRows,table_columns, '全部字段类型-提供默认值-select')
                    }
                  }}
                  selectedKeys={[]}
                >
                  <Menu.Item key="remove">批量删除</Menu.Item>
                                      <Menu.Item key="export_current">导出已选</Menu.Item>
                </Menu>
              }
            >
              <Button>
                批量操作 <DownOutlined />
              </Button>
            </Dropdown>
          ),
        ]}
        tableAlertRender={({selectedRowKeys, selectedRows}) => (
          selectedRowKeys.length > 0 ? <div>
            已选择{' '}
            <a
              style={{
                fontWeight: 600,
              }}
            >
              {selectedRowKeys.length}
            </a>{' '}
            项&nbsp;&nbsp;
          </div> : false

        )}
        request={(params, sorter, filter) => queryDemoDefaultModel({...params, sorter, filter})}
        columns={table_columns}
        rowSelection={{}}
      />
      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <ProTable
                     formRef={addFormRef}
          onSubmit={async value => {
                          richTrans(value);
            const success = await handleAdd(value);

            if (success) {
              handleModalVisible(false);

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="key"
          type="form"
          search={{}}
          form={
            {
              labelCol: {span: 6},
              labelAlign: 'left',
            }}
          columns={create_columns}
          rowSelection={{}}
        />
      </CreateForm>
      <UpdateForm onCancel={() => handleUpdateModalVisible(false)} modalVisible={updateModalVisible}>
        <ProTable
          formRef={updateFormRef}
          onSubmit={async value => {
                          richTrans(value);
            const success = await handleUpdate(value, updateFormValues.id);

            if (success) {
              handleUpdateModalVisible(false);

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="key"
          search={{}}
          type="form"
          form={{
            initialValues: updateFormValues, labelCol: {span: 6},
            labelAlign: 'left',
          }}
          columns={update_columns}
          rowSelection={{}}
        />
      </UpdateForm>
        
    </PageHeaderWrapper>
  );
};

export default TableList;