'use client';

import { useFormContext } from 'react-hook-form';
// import { FileInput } from '@/components/shared/input/FileInput';
import { PasswordInput } from '@/components/shared/input/PasswordInput';
import { SelectInput } from '@/components/shared/input/SelectInput';
import { TextAreaInput } from '@/components/shared/input/TextAreaInput';
import { TextInput } from '@/components/shared/input/TextInput';
import { ROLE_OPTIONS, ROLES } from '@/enums/roles.enum';
import { MediaSelectInput } from '@/components/shared/input/MediaSelectInput';
// import { staffService } from '@/services/staff.service';

function StaffFormFields() {
  const { control } = useFormContext();

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TextInput control={control} name="name" label="Name" placeholder="Enter name" />

        <TextInput control={control} name="email" label="Email" placeholder="Enter email" type="email" />

        <PasswordInput control={control} name="password" label="Password" placeholder="Enter password" />
        <PasswordInput
          control={control}
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Enter password"
        />

        <SelectInput
          control={control}
          name="role"
          label="Role"
          placeholder="Select role"
          options={ROLE_OPTIONS.map(r => ({
            value: r,
            label: r.charAt(0).toUpperCase() + r.slice(1),
          }))}
        />
      </div>

      <TextAreaInput
        control={control}
        name="bio"
        label="Bio"
        placeholder="Enter bio"
        className="min-h-[100px]"
      />

      {/* Featured image */}
      <MediaSelectInput control={control} name="image" label="Profile Image" typeFilter="image" />
    </>
  );
}

export default StaffFormFields;
