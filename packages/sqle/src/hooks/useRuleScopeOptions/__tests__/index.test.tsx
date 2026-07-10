import {
  buildFlatRuleOptionsFromRules,
  buildRuleSelectValue,
  mergeRulesWithSavedDisplay
} from '../index';
import { DB_TYPE_RULE_NAME_SEPARATOR } from '../../useRuleTips';

describe('sqle/hooks/useRuleScopeOptions', () => {
  it('buildRuleSelectValue uses db type separator', () => {
    expect(buildRuleSelectValue('MySQL', 'rule_a')).toBe(
      `MySQL${DB_TYPE_RULE_NAME_SEPARATOR}rule_a`
    );
  });

  it('buildFlatRuleOptionsFromRules maps desc and value', () => {
    expect(
      buildFlatRuleOptionsFromRules(
        [{ rule_name: 'rule_a', desc: 'Rule A' }, { rule_name: 'rule_b' }],
        'MySQL'
      )
    ).toEqual([
      {
        label: 'Rule A',
        value: `MySQL${DB_TYPE_RULE_NAME_SEPARATOR}rule_a`
      },
      {
        label: 'rule_b',
        value: `MySQL${DB_TYPE_RULE_NAME_SEPARATOR}rule_b`
      }
    ]);
  });

  it('mergeRulesWithSavedDisplay appends saved rules not in list', () => {
    expect(
      mergeRulesWithSavedDisplay(
        [{ rule_name: 'rule_a', desc: 'Rule A' }],
        [
          {
            rule_name: 'rule_a',
            rule_desc: 'Rule A saved'
          },
          {
            rule_name: 'offline_rule',
            rule_desc: 'Offline rule'
          }
        ],
        'MySQL'
      )
    ).toEqual([
      { rule_name: 'rule_a', desc: 'Rule A' },
      {
        rule_name: 'offline_rule',
        desc: 'Offline rule',
        db_type: 'MySQL'
      }
    ]);
  });
});
