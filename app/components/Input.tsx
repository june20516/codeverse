import { ChangeEventHandler } from 'react';

const TextInput = ({
  type = 'text',
  placeholder = 'type here',
  hasLabel = true,
  label,
  onChange,
}: {
  type?: HTMLInputElement['type'];
  placeholder?: string;
  hasLabel?: boolean;
  label?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}) => {
  return (
    <div className="inline-block border-b border-b-primary-900">
      <label className="space-x-2">
        <span>{label}</span>
        <input
          type={type}
          className="focus-visible:outline-none"
          placeholder={placeholder}
          onChange={onChange}
        />
      </label>
    </div>
  );
};

export default TextInput;
