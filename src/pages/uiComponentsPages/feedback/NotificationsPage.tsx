import React, { useState } from 'react';
import { Card, Tabs, Form, Input, Select, Button, Checkbox, Typography, Divider } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';

const { Title } = Typography;

const teacherTypeOptions = [
  { label: 'NONE', value: 'NONE' },
  { label: 'High School', value: 'High School' },
  { label: 'Primary', value: 'Primary' },
];

const standards = [
  { key: 1, label: 'Classroom 1A' },
  { key: 2, label: 'Classroom 1B' },
  { key: 3, label: 'Classroom 1C' },
  { key: 4, label: 'Classroom 1D' },
  { key: 5, label: 'Classroom 1E' },
  { key: 6, label: 'Classroom 2A' },
  { key: 7, label: 'Classroom 2B' },
  { key: 8, label: 'Classroom 2C' },
  { key: 9, label: 'Classroom 2D' },
  { key: 10, label: 'Classroom 2E' },
  { key: 11, label: 'Classroom 3A' },
  { key: 12, label: 'Classroom 3B' },
  { key: 13, label: 'Classroom 3C' },
  { key: 14, label: 'Classroom 3D' },
  { key: 15, label: 'Classroom 3E' },
];

const subjects = [
  'Bahasa Melayu',
  'English',
  'Sejarah',
  'Science',
];

const DataRestriction = () => {
  const [checkedStandards, setCheckedStandards] = useState<number[]>([]);
  const [checkedSubjects, setCheckedSubjects] = useState<Record<number, string[]>>({});
  const [expandedClassrooms, setExpandedClassrooms] = useState<number[]>(standards.map(s => s.key));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStandard, setSelectedStandard] = useState<number | null>(null);

  const handleStandardChange = (standardKey: number, checked: boolean) => {
    setCheckedStandards(prev =>
      checked ? [...prev, standardKey] : prev.filter(k => k !== standardKey)
    );
    if (!checked) {
      setCheckedSubjects(prev => {
        const newSubjects = { ...prev };
        delete newSubjects[standardKey];
        return newSubjects;
      });
    }
  };

  const handleSubjectChange = (standardKey: number, subjectList: CheckboxValueType[]) => {
    setCheckedSubjects(prev => ({
      ...prev,
      [standardKey]: subjectList as string[],
    }));
  };

  const handleAllChange = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      setCheckedStandards(standards.map(s => s.key));
      setCheckedSubjects(
        standards.reduce((acc, s) => {
          acc[s.key] = subjects;
          return acc;
        }, {} as Record<number, string[]>)
      );
    } else {
      setCheckedStandards([]);
      setCheckedSubjects({});
    }
  };

  const isAllChecked =
    checkedStandards.length === standards.length &&
    standards.every(s => checkedSubjects[s.key]?.length === subjects.length);

  const handleClassroomCheck = (standardKey: number, checked: boolean) => {
    setCheckedSubjects(prev => ({
      ...prev,
      [standardKey]: checked ? subjects : [],
    }));
  };

  const handleToggleExpand = (standardKey: number) => {
    setExpandedClassrooms(prev =>
      prev.includes(standardKey)
        ? prev.filter(k => k !== standardKey)
        : [...prev, standardKey]
    );
  };

  // Filter standards based on search and standard dropdown
  const filteredStandards = standards.filter(s => {
    const matchesSearch = s.label.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesDropdown = true;
    if (selectedStandard) {
      matchesDropdown = s.label.startsWith(`Classroom ${selectedStandard}`);
    }
    return matchesSearch && matchesDropdown;
  });

  return (
    <div style={{ position: 'relative', padding: '0 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Typography.Title
          level={4}
          style={{
            margin: 0,
            fontWeight: 700,
            color: '#fff',
            flex: 1,
            minWidth: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          Choose Classroom and Subject
        </Typography.Title>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginLeft: 16 }}>
          <Select
            allowClear
            placeholder="Select standard"
            style={{ width: 180 }}
            value={selectedStandard}
            onChange={val => setSelectedStandard(val)}
            options={[
              { label: 'Standard 1', value: 1 },
              { label: 'Standard 2', value: 2 },
              { label: 'Standard 3', value: 3 },
            ]}
          />
          <Input.Search
            placeholder="Search classroom"
            allowClear
            size="middle"
            style={{ width: 250 }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <Divider style={{ margin: '8px 0 24px 0' }} />
      <div style={{ padding: 0 }}>
        <Checkbox
          checked={isAllChecked}
          indeterminate={
            checkedStandards.length > 0 && !isAllChecked
          }
          onChange={handleAllChange}
          style={{ marginBottom: 24, fontWeight: 500, fontSize: 18 }}
        >
          All
        </Checkbox>
        <div>
          {filteredStandards.map((standard) => {
            const selectedSubjects = checkedSubjects[standard.key] || [];
            const allChecked = selectedSubjects.length === subjects.length;
            const indeterminate = selectedSubjects.length > 0 && !allChecked;
            const expanded = expandedClassrooms.includes(standard.key);

            // Use a different color for Classroom 1, 2, and 3
            const isClassroom1 = standard.label.startsWith('Classroom 1');
            const isClassroom2 = standard.label.startsWith('Classroom 2');
            const isClassroom3 = standard.label.startsWith('Classroom 3');
            let classroomStyle;
            if (isClassroom1) {
              classroomStyle = {
                fontWeight: 700,
                fontSize: 20,
                color: '#fff',
                background: '#008080', // teal
                borderRadius: 6,
                padding: '2px 12px',
                cursor: 'pointer',
                letterSpacing: 0.5,
              };
            } else if (isClassroom2) {
              classroomStyle = {
                fontWeight: 700,
                fontSize: 20,
                color: '#fff',
                background: '#3b5998', // blue
                borderRadius: 6,
                padding: '2px 12px',
                cursor: 'pointer',
                letterSpacing: 0.5,
              };
            } else if (isClassroom3) {
              classroomStyle = {
                fontWeight: 700,
                fontSize: 20,
                color: '#fff',
                background: '#7c3aed', // purple
                borderRadius: 6,
                padding: '2px 12px',
                cursor: 'pointer',
                letterSpacing: 0.5,
              };
            } else {
              classroomStyle = {
                fontWeight: 700,
                fontSize: 20,
                color: '#fff',
                background: 'rgba(255,255,255,0.06)',
                borderRadius: 6,
                padding: '2px 12px',
                cursor: 'pointer',
                letterSpacing: 0.5,
              };
            }

            return (
              <div key={standard.key} style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                  <Checkbox
                    checked={allChecked}
                    indeterminate={indeterminate}
                    onChange={e => handleClassroomCheck(standard.key, e.target.checked)}
                    style={{ marginRight: 8 }}
                  />
                  <span
                    style={classroomStyle}
                    onClick={() => handleToggleExpand(standard.key)}
                  >
                    {standard.label}
                  </span>
                </div>
                {expanded && (
                  <div style={{ marginLeft: 40, marginTop: 8, display: 'flex', gap: 32 }}>
                    <Checkbox.Group
                      options={subjects.map(subj => ({
                        label: <span style={{ fontWeight: 400, fontSize: 16, color: '#bfc4d1' }}>{subj}</span>,
                        value: subj,
                      }))}
                      value={selectedSubjects}
                      onChange={list => handleSubjectChange(standard.key, list)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const NotificationsPage: React.FC = () => {
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      // handle save logic here
      form.resetFields();
    });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
      <Card
        style={{
          width: 1000,
          height: 800,
          borderRadius: 20,
          boxShadow: '0 4px 32px 0 rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
        bodyStyle={{
          padding: 0,
          height: 800 - 72, // 72px for the footer (adjust if needed)
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Tabs
          defaultActiveKey="information"
          centered
          style={{ flex: 1, minHeight: 0 }}
          tabBarStyle={{
            position: 'sticky',
            top: 0,
            zIndex: 3,
            background: '#181c32',
          }}
          items={[
            {
              key: 'information',
              label: 'Information',
              children: (
                <div style={{ padding: 24, height: 656, overflow: 'auto' }}>
                  <Form
                    form={form}
                    layout="vertical"
                    initialValues={{}}
                    style={{ border: '1px solid #222', borderRadius: 4, padding: 24, marginBottom: 24 }}
                  >
                    <Form.Item label="Full Name" name="fullName" rules={[{ required: true, message: 'Please enter full name' }]}> 
                      <Input placeholder="Full Name" />
                    </Form.Item>
                    <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter email' }]}> 
                      <Input placeholder="Email" />
                    </Form.Item>
                  </Form>
                </div>
              ),
            },
            {
              key: 'data-restriction',
              label: 'Data Restriction',
              children: (
                <div style={{ height: 656, overflow: 'auto' }}>
                  <DataRestriction />
                </div>
              ),
            },
          ]}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, padding: 24, paddingTop: 0 }}>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type="primary" onClick={handleSave}>Save</Button>
        </div>
      </Card>
    </div>
  );
};

export default NotificationsPage;
