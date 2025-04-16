# @repo/i18n

Internationalization package for the application. This package provides type-safe translations for English and Spanish.

## Structure

- `src/types.ts`: Type definitions for all translation keys
- `src/translations/en.ts`: English translations
- `src/translations/es.ts`: Spanish translations

## Usage

### Adding New Translations

1. Use the `add-i18n-key.mdc` rule in Cursor:
   ```bash
   # In Cursor, run:
   Cursor: Run Rule
   # Select add-i18n-key.mdc
   ```

2. Provide the required inputs:
   - `keyPath`: Full path for the new key (e.g., `common.submitButton`)
   - `englishTranslation`: English text
   - `spanishTranslation`: Spanish text

3. After adding translations:
   ```bash
   pnpm build --filter @repo/i18n
   pnpm dev --filter @repo/customer-pwa
   ```

### Validating Translations

Run the TypeScript type checker to validate:
- Type safety of translations
- Structural consistency
- Key completeness

```bash
pnpm validate
```

## Best Practices

1. **Key Naming**
   - Use dot notation for nested keys
   - Group related keys under common namespaces
   - Use descriptive, consistent naming

2. **Translation Quality**
   - Keep translations concise and clear
   - Use proper punctuation and formatting
   - Consider cultural differences

3. **Type Safety**
   - Always use the `t()` function with type-safe keys
   - Run validation before committing changes
   - Keep translations in sync with type definitions

4. **Maintenance**
   - Regularly run validation checks
   - Update translations when UI changes
   - Document any special formatting rules

## Development

### Setup

```bash
pnpm install
```

### Building

```bash
pnpm build
```

### Development Mode

```bash
pnpm dev
```

## Contributing

1. Follow the key naming conventions
2. Add translations for both languages
3. Run validation before submitting changes
4. Update documentation if needed 