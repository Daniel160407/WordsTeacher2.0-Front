const FormField = ({ id, label, type, value, onChange, placeholder, required }) => (
    <div className="form-group">
        <label htmlFor={id}>{label}</label>
        <input
            type={type}
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            aria-required={required}
        />
    </div>
);

export default FormField;